import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class CallConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connection',
            'data': {
                'message': "Connected"
            }
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.my_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        eventType = text_data_json['type']
        if eventType == 'login':
            name = text_data_json['data']['name']
            self.my_name = name
            await self.channel_layer.group_add(
                self.my_name,
                self.channel_name

            )

        if eventType == 'call':
            name = text_data_json['data']['name']
            await self.channel_layer.group_send(
                name,
                {
                    'type': 'call_received',
                    'data': {
                        'caller': self.my_name,
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'answer_call':
            caller = text_data_json['data']['caller']
            await self.channel_layer.group_send(
                caller,
                {
                    'type': 'call_answered',
                    'data': {
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'call_decline':
            name = text_data_json['data']['name']
            await self.channel_layer.group_send(
                name,
                {
                    'type': 'call_decline',
                    'data': {
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'user_left':
            name = text_data_json['data']['name']
            await self.channel_layer.group_send(
                name,
                {
                    'type': 'user_left',
                    'data': {
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'ICEcandidate':
            user = text_data_json['data']['user']
            await self.channel_layer.group_send(
                user,
                {
                    'type': 'ICEcandidate',
                    'data': {
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

    async def call_received(self, event):
        await self.send(text_data=json.dumps({
            'type': 'call_received',
            'data': event['data']
        }))

    async def call_answered(self, event):
        await self.send(text_data=json.dumps({
            'type': 'call_answered',
            'data': event['data']
        }))

    async def call_decline(self, event):
        await self.send(text_data=json.dumps({
            'type': 'call_decline',
            'data': event['data']
        }))

    async def user_left(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_left',
            'data': event['data']
        }))

    async def ICEcandidate(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ICEcandidate',
            'data': event['data']
        }))

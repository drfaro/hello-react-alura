import PubSub from 'pubsub-js';

export default class TratadorErros{


	publicaErros(error){
		console.log(error)

		PubSub.publish('atualiza-erro-autor',error);
	}

}
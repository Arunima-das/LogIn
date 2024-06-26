import firestore from "@react-native-firebase/firestore";

const db = firestore();

export async function signUp(username, password){
	if( (await db.collection("users").where("username", "==", username).get()).docs.length>0){
		return false;
	}
	 doc = await db.collection("users").add({username, password});
	return doc.id;
}

export async function signIn(username, password){
	const docs = (await db.collection("users").where("username", "==", username).get()).docs?.map(doc => ({id:doc.id, ...doc.data()}));
	if(docs && docs.length>0){
		if(docs[0].password===password){
			return docs[0].id;
		}
		return false;
	}
	return false;
}

const functions = {signUp, signIn};

export default functions;

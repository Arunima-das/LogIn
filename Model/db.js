import firestore from "@react-native-firebase/firestore";

const db = firestore();

export async function signUp(username, password){
	if( (await db.collection("users").where("username", "==", username).get()).docs.map(doc => doc.data()).length>0){
		return false;
	}
	 doc = await db.collection("users").add({username, password});
	return doc.id;
}

export async function signIn(username, password){
	const docs = (await db.collection("users").where("username", "==", username)).docs.map(doc => doc.data());
	if(docs.length>0){
		if(docs[0].password===password){
			return docs[0].id;
		}
	}
	return false;
}

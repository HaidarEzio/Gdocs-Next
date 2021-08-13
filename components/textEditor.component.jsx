import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

//? here we're trying to not get fucked by Window Not Defined, so we're sedning it to the client only, and not the server
// import { Editor } from "react-draft-wysiwyg";
const Editor = dynamic(() => import("react-draft-wysiwyg").then((module) => module.Editor), { ssr: false });

function TextEditor() {
  const [session] = useSession();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter();
  const { id } = router.query;

  const [snapshot] = useDocumentOnce(db.collection("userDocs").doc(session?.user?.email).collection("docs").doc(id));

  //? in here we're pulling data, and we're just looking at it from the DB, and we're setting that content FROM raw, with the data there, and we're connecting it to snapshot
  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(EditorState.createWithContent(convertFromRaw(snapshot?.data()?.editorState)));
    }
  }, [snapshot]);

  //! this is very common, when we try to get state from a body, we gotta map that shit back too
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    //! in here we're saving everything the user types, and it merges it, not let it coexist and since we can't just send in the state, and it's not serializable, so we use the convert to raw and convert from raw
    db.collection("userDocs")
      .doc(session?.user?.email)
      .collection("docs")
      .doc(id)
      .set({ editorState: convertToRaw(editorState.getCurrentContent()) }, { merge: true });
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 p-10 bg-white shadow-lg max-w-6xl mx-auto mb-12 border"
      />
    </div>
  );
}
export default TextEditor;

import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { getSession, signout, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import Login from "../../components/login.component";
import TextEditor from "../../components/textEditor.component";
import { db } from "../../firebase";

function Doc() {
  const [session] = useSession();
  if (!session) return <Login />;

  const router = useRouter();
  const { id } = router.query;
  const [snapshot, loadingSnapshot] = useDocumentOnce(db.collection("userDocs").doc(session?.user.email).collection("docs").doc(id));

  //? if you copy a url that's already here, and ya don't got access for em, throw these mofos back to the home screen
  if (!loadingSnapshot && !snapshot?.data()?.fileName) {
    router.replace("/");
  }

  return (
    <div>
      <header className="flex justify-between items-center p-3 pb-1">
        <span onClick={() => router.push("/")} className="cursor-pointer">
          <Icon name="description" size="5xl" color="blue" />
        </span>

        <div className="flex-grow px-2">
          <h2 className="">{snapshot?.data()?.fileName}</h2>
          <div className="flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600">
            <p className="option">File</p>
            <p className="option">Edit</p>
            <p className="option">View</p>
            <p className="option">Insert</p>
            <p className="option">Format</p>
            <p className="option">Tools</p>
          </div>
        </div>

        <Button
          color="lightBlue"
          buttonType="filled"
          size="regular"
          rounded={false}
          block={false}
          iconOnly={false}
          ripple="light"
          className="hidden md:inline-flex h-10"
        >
          <Icon name="people" size="md" /> SHARE
        </Button>
        <img className="rounded-full cursor-pointer h-10 w-10 ml-2" src={session?.user?.image} alt="" />
      </header>
      <TextEditor />
    </div>
  );
}

export default Doc;

//! it fetches the user before hand, from the server baby
export async function getServerSideProps(context) {
  const session = getSession(context);
  return {
    props: {
      session,
    },
  };
}

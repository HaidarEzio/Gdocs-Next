import Head from "next/head";
import Header from "../components/header.component";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Image from "next/image";
import { getSession, useSession } from "next-auth/client";
import Login from "../components/login.component";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { useState } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import DocumentRow from "../components/docRow.component";

export default function Home() {
  //! if there's someone, then fill this with their credentials
  const [session] = useSession();
  //! user not signed in ? show the login comp
  if (!session) return <Login />;
  const [showModal, setShowModal] = useState(false);
  //? we're managing our input here, with a simple useState hook, rather than a reducer
  const [input, setInput] = useState("");
  //! Real time listener to the DB, for the exact user, and we can use that, to prepopulate some page
  const [snapshot] = useCollectionOnce(db.collection("userDocs").doc(session.user.email).collection("docs").orderBy("timestamp", "desc"));

  const createDocument = () => {
    //? we don't like empty inputs
    if (!input) return;
    //? sending to the database, and useing the server timestamp so that everything works out nicely
    db.collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .add({ fileName: input, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    //? Clear the modal
    setInput("");
    setShowModal(false);
  };

  const modal = (
    <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          type="text"
          className="outline-none w-full"
          placeholder="Enter name of docuemnt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="blue" buttonType="link" onClick={(e) => setShowModal(false)} ripple="dark">
          Cancel
        </Button>

        <Button color="blue" onClick={createDocument} ripple="light">
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div className="">
      <Head>
        <title>Google Docs Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {modal}
      <Header />
      <section className="bg-[#F8F9FA] pb-10 px10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700 text-lg">Start a New Document</h2>
            <Button color="gray" buttonType="outline" iconOnly={true} ripple="dark" className="border-0">
              <Icon name="more_vert" size="3xl" color="gray"></Icon>
            </Button>
          </div>
          <div className="">
            <div onClick={() => setShowModal(true)} className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700">
              <Image src="https://links.papareact.com/pju" layout="fill" />
            </div>

            <p className="ml-2 mt-2 font-semibold text-sm text-gray-700">Blank</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-10">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5">
            <h2 className="flex-grow font-medium">My Documents</h2>
            <p className="mr-12">Date Created</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>
          {snapshot?.docs.map((doc) => (
            <DocumentRow key={doc.id} id={doc.id} fileName={doc.data().fileName} date={doc.data().timestamp} />
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}

import Head from "next/head";
import Header from "../components/header.component";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Google Docs Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <section></section>
    </div>
  );
}

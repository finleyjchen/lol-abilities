import React from "react"
import Link from "next/link"
import Layout from '../components/Layout'

import Form from "../components/Form"
// import '../css/tailwind.css'




// export async function getStaticProps() {
//   // Call an external API endpoint to get posts.
//   const res = await axios.get("/api/patch")
//   const patch = await res.json()

//   // By returning { props: posts }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       patch,
//     },
//   }
// }

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout title="LOLAbilities" description="Realtime champion ability information for League of Legends.">
        <section className="p-10">

        <header className="text-color-lol">
          <h1 className="text-2xl md:text-4xl font-bold"><Link href="/">LOLAbilities</Link></h1>
          <p>Realtime champion ability information</p>
        </header>
        </section>
        <Form />
      </Layout>
      
    );
  }
}

export default Home;

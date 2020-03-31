import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default class extends React.Component {
  constructor(props) {
    super(props)
  
  }



  render() {
    return (
      <React.Fragment>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title> {this.props.title || "Next.js Starter Project"} </title>{" "}
          <link href="https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Fira+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;700&display=swap" rel="stylesheet"/>
        </Head>
        <header className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold"><Link href="/">LOLAbilities.com</Link></h1>
          <p>Learn the abilities of your active game's champions</p>
          <p>Current DataDragon version:</p>
        </header>
        <main>
            {this.props.children}
        </main>
      </React.Fragment>
    );
  }
}

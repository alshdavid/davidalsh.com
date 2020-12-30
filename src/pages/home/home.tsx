import './home.scss'
import React from "react"
import { Page } from '../../components'

export const HomePage = () => {
  return <Page 
    pageTitle="Home Page" 
    className="page-home">
    <div>
      {/* <div className="floating-menu">
        <a href="">Portfolio</a>
        <a href="">Resume</a>
        <a href="/articles">Articles</a>
        <a href="">YouTube</a>
      </div> */}
      <div>
        <h1>David Alsh</h1>
        <h2>Software Engineer</h2>
        <a href="">Portfolio</a>
        <a href="">Resume</a>
        <a href="/articles">Articles</a>
        <a href="">YouTube</a>
      </div>
    </div>
    <div>
      {/* <div className="profile-picture" style={{ backgroundImage: 'url("/assets/profile.jpg")'}}></div> */}
    </div>
  </Page>
}

import './navbar.scss'
import React from "react"
import { Container, Link } from '../../components'

export const Navbar = () => {
  return (
    <Container className="partial-navbar">
      <nav>
        <Link href="/home">
          <h1>David Alsh <small>Software Engineer</small></h1>
        </Link>
        <div>
          <Link href="/articles">Articles</Link>
          <Link href="">Portfolio</Link>
          <Link href="">Resume</Link>
        </div>
      </nav>
    </Container>
  )
}

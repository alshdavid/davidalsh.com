<h1> 
  📦 Writing a Bundler - From Source to Bundle (TODO)
</h1>

This is the first episode in a series that explores writing a web bundler.

To get an understanding of what we need do, this article will focus on the high level steps and outputs bundlers go through.

We will go over example source files, taking them step by step from start to finished product, visualizing the transformation along the way.

<div class="hero">
  <img src="assets/hero.webp" />
  <i>JavaScript - Fellowship of the module</i> 
</div>

## Introduction

Over the course of many years, the web has evolved from a place to host basic documents (like Wikipedia, blogs, and static sites) into a powerful cross platform environment for writing applications that are feature-rich enough to rival native desktop and mobile applications (like Jira, Spotify, Slack, etc).

In response to the growing demands of web based applications, web browser vendors formed a governing body known as the W3C to coordinate and add functionality to browsers, enabling richer experiences and expanded business use cases.

For better or for worse, factors like the ease of distribution, cost/ease of development, and the absolute insanity of the alternative of native desktop APIs has lead to basically everything becoming a web based application.

## The Problem

As web applications expand in functionality, they grow in disk size and (source code) complexity.

Given web applications are downloaded and executed on demand when an end user visits a website, it’s vital that the application is delivered to the end user such that it offers the best possible experience.

Characteristics like these affect the user’s perception of their experience:

How long does the end user wait for the application to show anything?

How long until the end user can interact with something on the application?

Does the end user see a janky shuffling of elements as the application loads?

etc

The experience of the end user is currently described and measured using Web Vitals.

There are many different approaches to solving these issues, like server side rendering, server components and other types of magic - but today we will be talking about how bundlers can help with this problem space.
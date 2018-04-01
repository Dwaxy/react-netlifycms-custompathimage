# react-netlifycms-custompathimage

Custom widget for images for NetlifyCMS that allows to load them from a custom path.

This widget has been created to fix an incompatibility between [NetlifyCMS](https://www.netlifycms.org/) and [Gatsby.js](https://www.gatsbyjs.org/).

## The problem

To be able to use Gatsby.js's built-in image processing capabilities([`gatsby-image`](https://www.gatsbyjs.org/packages/gatsby-image/)) from , `gatsby-transformer-sharp` has to parse an image path as relative (starting with `./` or  `../`). However, NetlifyCMS saves image paths as absolute (starting with `/`).

## The fix

This custom widget lets NetlifyCMS save the image file according to its settings, but saves the image path in a custom path of your chosing. It also loads the images in the preview directly from the backend, otherwise the images will have an eroneous path and won't load.

## How to use and configure

1. You need to have these plugins installed in Gatsby.js:
  - [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/) configured with your image folder (`/images` for example);
  - [`gatsby-plugin-sharp`](https://www.gatsbyjs.org/packages/gatsby-plugin-sharp/) and [`gatsby-transformer-sharp`](https://www.gatsbyjs.org/packages/gatsby-transformer-sharp/) for image processing capabilities and node transformation;
  - [`gatsby-plugin-netlify-cms`](https://www.gatsbyjs.org/packages/gatsby-plugin-netlify-cms/) for NetlifyCMS to work with Gatsby.js.
That gives us a `gatsyb-config.js` looking something like this:
```javascript
plugins: [
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/images`,
      name: "images",
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  {
    resolve: `gatsby-plugin-netlify-cms`,
    options: {
      modulePath: `${__dirname}/src/cms/cms.js`,
    },
  },
];
```
2. Copy `customPathImage.js` from this repository in `/src/cms/`. Then create or edit your `cms.js` as follow:
```javascript
import React from "react";
import CMS from "netlify-cms";
import "netlify-cms/dist/cms.css";

// import my homemade widget
import { CustomPathImageControl, CustomPathImagePreview } from "./customPathImage.js";

// register it to be able tu use it in NetlifyCMS
CMS.registerWidget("custompathimage", CustomPathImageControl, CustomPathImagePreview);

```
3. Create or edit your NetlifyCMS's config.yml by using the widget `custompathimage` instead of `image` in your collection(s). Let's say my project is organized like this :
```

images/
|- photo1.jpg
|- photo2.jpg
collections/
|- entry1.md
|- entry2.md

```
This widget has two custom fields :
  - `customMediaPath`: pretty self-explanatory, the custom path (without the filename) that will be saved by the CMS, i.e. the path that will be loaded by Gatsby.js. In my example the relative path to access `photo1.jpg` from `entry1.md` is `../images/photo1.jpg` so `customMediaPath` is set to `../images/`;
  - `rawMediaPath`: the "raw" path to access the files on your backend (GitHub, GitLab...). If you're using GitHub, your repository is `user/repo`, your using the `master` branch and the image folder is `images`, this path is `https://raw.githubusercontent.com/user/repo/master/images/`
A simple `config.yml` is:
```yaml

backend:
  name: github
  repo: user/repo

media_folder: images

collections:
  - name: "entries"
    label: "Entries"
    folder: "collections"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - label: "Image"
        name: "image"
        widget: "custompathimage"
        customMediaPath: "../images/"
        rawMediaPath: "https://raw.githubusercontent.com/user/repo/master/images/"
      - {label: "Body", name: "body", widget: "markdown"}

```
4. And voilà! Create your first entry in NetlifyCMS and don't forget to call `childImageSharp` in your GraphQL query:
```graphql
query EntriesQuery {
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          title
          image {
            childImageSharp {
              sizes(maxWidth: 800) {
                ...GatsbyImageSharpSizes_withWebp
              }
            }
          }
        }
        html
      }
    }
  }
}
```
## Notes
1. This widget comes with absolutely no warranty. It may or may not work but shouldn't break anything. Besides it's [unlicensed] (https://unlicense.org/) so do whatever you want with it.
2. This is supposed to be a temporary fix until [NetlifyCMS's Issue #325](https://github.com/netlify/netlify-cms/issues/325) is fixed. That means I'm currently not planning on improving it, except if I encounter bugs on my own. You're welcome to fork this!
3. I've used it with Markdown but it should work with other formats.
4. I've used it as a Widget but it should also work as an Editor Component ([Custom Widgets](https://www.netlifycms.org/docs/custom-widgets/)).

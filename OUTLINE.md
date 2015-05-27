*Note: this is a living document.*

This document outlines the plans, ideas, and researches about the next version of /r/indonesia's subreddit design.

---

## **Outline**

* **Built from scratch**  
  The previous version from *marssantoso* was built on top of /r/Naut, a very popular subreddit stylesheet. As cool as the design is, the code is a huge mess and not up to scratch compared to the standard on web development. Lots of hacks are in place to design elements not common to the original reddit design, which is fine but with the lack of documentations and the nature of CSS looking like hardcoded programming is very hard to understand.  

  The new subreddit will feature the latest development standards in practice in the web development world. We're relying on [Sass](http://sass-lang.com) — basically CSS with steroids, to give us a better code structure; and [Gulp](http://gulpjs.com) with [BrowserSync](http://browsersync.io) to give us a local development workflow that updates real-time every time the code is saved without the need of regularly pushing the stylesheet to /r/indoclone to test it publicly.

* **Style**  
  Inspirations are going to be taken from elements that make sense on an Indonesian culture standpoint. This sounds cheesy, yeah, but the point is to make /r/indonesia looking different than the typical subreddit styles like /r/Naut provides, or iOS and Android designs. It might look similar, but it wouldn't be 100% same.  
  Things that can be easily influenced with, for example, can be icons.

* **Deadline**  
  **August 2015** by the latest, or before /r/indonesia reaches 10,000 subscribers

---

## **Feature List**

* **Responsive Design**  
  *anak_jakarta* has requested this one since I assumed position, so this feature will be available on v2 for mobile users.

* **Multi language support**  
  Reddit allows users to use subdomains to access Reddit, as long as it's two characters long. For example, try and access id.reddit.com and you'll find a half-translated Indonesian version of Reddit.  
  The good thing is, CSS can take advantage of this because of Reddit adding the subdomain to the HTML as the language code, even though it's not an ISO language code. So you can access zz.reddit.com and it will still display that language code in the HTML. With this, we can tap into it using CSS and tailor the CSS accordingly. Reddit Bahasa Indonesia for /r/indonesia? Yep. Boso Jowo? Yowes, jw.reddit.com. Sunda? sd.reddit.com. Wanted to please the upcoming bilateral dialogue visitors? Sure, Singaporeans can use sg.reddit.com.

  Of course, we need to write the content in the respective languages, but I'm sure with enough contributors we can do this.

* **Night mode support,** ***even for non-RES users***  
  The same feature we benefited from Reddit for the multi language support can be used for night mode too, nm.reddit.com. With this we can make the same look available for RES users, and for non-RES users can use the night mode using the link too. You might have seen this feature on several subreddits, we're just bringing this one to /r/indonesia.

* **A bot!**  
  This bot is mostly used for development purposes and to aid in the development and maintenance of the subreddit stylesheet, but can be open to any suggestions from users to add in more features useful for the community. **We also need a name for it.**

  Currently the features in the bot planned for at least the first stage of the v2 redesign would only be for development purposes, which are:

  * *[DEV] Bug tracking*  
  This will benefit me at least. By making a bot, I can then call !indobot issue "Name the issue" in a comment and it will add an issue in GitHub with the permalink to the reported bug in Reddit automatically. This will save time for me to switch between GitHub and Reddit to document issues or feature requests posted by the community.

  * *[DEV] Automated deployment*  
  With this I can call the command line and the stylesheet will be updated without the need for me to copy and paste things back and forth the text editor and Reddit. The deployment can also be specified if I wanted to deploy on /r/indoclone or /r/indonesia, or maybe even somewhere else.

* **Special flairs and username display for special users**  
  We know how *Mental_octo* has a special username display and so does *anak_jakarta*. This system will be greatly expanded on v2 to allow a more diverse array of designs to specific people requested by the mods or the majority of the community with the consent of the mods too. In addition, for anybody wanting to pull off contests, the mods team can reward participants with special displays too.

  This feature needs to be considered and consulted with the Reddit rules heavily. We know what happened to *marssantoso* sadly, and we wouldn't want the same problem happening again.

* *And many more to be announced.* If you have any requests feel free to do so!

---

## **Contributing**

If you plan to help with the development, or know people who want to contribute or just offering resources for the development, here's a list of the things currently needed:

* Icons for elements of the website
* Vector file (e.g. Illustrator or Sketch) of designs of batik, or just a general knowledge of designing batik will be great
* Any designs made in Illustrator, preferably abstract and has something to do with the Indonesian culture is greatly appreciated
* Photographs of Indonesia, whether it's a landscape scenery of the hustle and bustle of an Indonesian city
* Design input or resources to share in the design, anything, whether it's elements of the design such as typography or buttons. I would then consider whether to put it or maybe at a later date

Contributions will be properly documented and credited accordingly. Thanks!

***More to be announced***.

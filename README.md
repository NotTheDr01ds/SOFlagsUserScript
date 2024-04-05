
# UserScripts for Stack Exchange by NotTheDr01ds

## GetSEFlags

*Summary*: Retrieves your post flags on a Stack Exchange site

* Activation is done via the TamperMonkey extension menu. Click the "Get Post Flags" option under the userscript menu to start.
* Status is reported in your browser dev console.

* Post flags are obtained from `https://site/users/flag-summary/yourUserId/group=1`
* Flags are returned as a JSON list of objects with the following keys:

  * *postId*: The id of the question or answer your flagged
  * *postLink*: A convenience URL to the flagged post
  * *postTitle*: The original title of the post
  * *postType*: A "question" or "answer"
  * *flagText*: The text of your flag
  * *flagHtml*: The HTML text of your flag, converted from Markdown
  * *flagCreatedTime*: The time you flagged.  Note that this may be converted to Unix Epoch at some point.
  * *flagStatus*: The current status, such as "Helpful", "pending", or "Declined", "Aged away", etc. For asthetics, I may change "pending" to "Pending" in the results.
  * *modMessage*: If a Moderator replied to your flag, this will include the message. Note that Markdown/HTML is currently not returned, so formatting may be lost.

* The returned JSON is placed on your clipboard
* There is a 2 second delay between fetching of each page of flags. If you have need of this script, you likely have enough flags for this to take a few minutes to fetch all pages.

### Credits

Thanks @starball for the original idea/code sample.
Thanks SpectricSO for the Legacy Profiles script I used as reference for the TamperMonkey template.

### Limitations

Issues/feature requests/PRs welcome, but no promises.

* There's not much in the way of error handling. It will probably fail spectacularly if you have no flags on a particular site, or sneeze, or it's a Tuesday ...
* Currently only post flags are returned. This excludes flags on comments.
* Launch is currently only the TamperMonkey extension menu. It would be possible to inject a launch mechanism directly into the Flags page as a future enhancement.
* Status is only reported via the dev console. As above, it would be possible to inject status updates directly into the page as a future enhancement.
* Meta sites are not included, but should be an easy enhancement.
* Data and format is subject to change, so don't rely on it as any type of API contract.

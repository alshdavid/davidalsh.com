

// const Reactions = (comments: CommentSummaryResponse[]) => {
//   function getReactions(index: number): ({ comments: number } & Record<keyof typeof Reactions, number>) | undefined {
//     const summary = comments[index]
//     if (!summary) {
//       return undefined
//     }
//     const output: { comments: number } & Record<keyof typeof Reactions, number> = {
//       comments: 0,
//       THUMBS_UP: 0,
//       THUMBS_DOWN: 0,
//       LAUGH: 0,
//       HOORAY: 0,
//       CONFUSED: 0,
//       HEART: 0,
//       ROCKET: 0,
//       EYES: 0,
//     }

//     if (summary.statusCode === 200) {
//       output.comments = summary.body.discussion.totalCommentCount + summary.body.discussion.totalReplyCount
//       output.THUMBS_UP = summary.body.discussion.reactions.THUMBS_UP.count
//       output.THUMBS_DOWN = summary.body.discussion.reactions.THUMBS_DOWN.count
//       output.LAUGH = summary.body.discussion.reactions.LAUGH.count
//       output.HOORAY = summary.body.discussion.reactions.HOORAY.count
//       output.CONFUSED = summary.body.discussion.reactions.CONFUSED.count
//       output.HEART = summary.body.discussion.reactions.HEART.count
//       output.ROCKET = summary.body.discussion.reactions.ROCKET.count
//       output.EYES = summary.body.discussion.reactions.EYES.count
//     }

//     return output
//   }

//   return <div class="reactions">
//     {(() => {
//       const summary = getReactions(i)
//       if (!summary) {
//         return <Fragment></Fragment>
//       }
//       return <Fragment>
//         <i class="comments">
//           <svg src="/assets/icons/chat.svg" svg-replace/>
//           {summary.comments}
//         </i>
//         {summary.THUMBS_UP !== 0 && <i class="thumbs_up"><span>👍</span>{summary.THUMBS_UP}</i>}
//         {summary.THUMBS_DOWN !== 0 && <i class="thumbs_down"><span>👎</span>{summary.THUMBS_DOWN}</i>}
//         {summary.LAUGH !== 0 && <i class="laugh"><span>😄</span>{summary.LAUGH}</i>}
//         {summary.HOORAY !== 0 && <i class="hooray"><span>🎉</span>{summary.HOORAY}</i>}
//         {summary.CONFUSED !== 0 && <i class="confused"><span>😕</span>{summary.CONFUSED}</i>}
//         {summary.HEART !== 0 && <i class="heart"><span>❤️</span>{summary.HEART}</i>}
//         {summary.ROCKET !== 0 && <i class="rocket"><span>🚀</span>{summary.ROCKET}</i>}
//         {summary.EYES !== 0 && <i class="eyes"><span>👀</span>{summary.EYES}</i>}
//       </Fragment>
//     })()}
//   </div>
// }

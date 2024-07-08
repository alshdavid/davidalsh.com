const API = 'https://caj26wf5n3.execute-api.ap-southeast-2.amazonaws.com'

export async function getSummary(...identifiers: string[]): Promise<CommentSummaryResponse[]> {
  return await fetch(API, {
    method: 'POST',
    body: JSON.stringify(identifiers)
  }).then(r => r.json())
}

export type CommentSummaryResponse = 
  {
    statusCode: 404
    body: CommentSummary404
  } | 
  {
    statusCode: 200
    body: CommentSummary
  }


export type CommentSummary404 = {}

export type CommentSummary = {
  "viewer": {
      "avatarUrl": string
      "login": string
      "url": string
  },
  "discussion": {
      "totalCommentCount": number,
      "totalReplyCount": number,
      "pageInfo": {
          "startCursor": string
          "hasNextPage": boolean,
          "hasPreviousPage": boolean,
          "endCursor": string
      },
      "reactionCount": 1,
      "reactions": {
          "THUMBS_UP": {
              "count": 1,
              "viewerHasReacted": boolean
          },
          "THUMBS_DOWN": {
              "count": number
              "viewerHasReacted": boolean
          },
          "LAUGH": {
              "count": number
              "viewerHasReacted": boolean
          },
          "HOORAY": {
              "count": number
              "viewerHasReacted": boolean
          },
          "CONFUSED": {
              "count": number
              "viewerHasReacted": boolean
          },
          "HEART": {
              "count": number
              "viewerHasReacted": boolean
          },
          "ROCKET": {
              "count": number
              "viewerHasReacted": boolean
          },
          "EYES": {
              "count": number
              "viewerHasReacted": boolean
          }
      },
      "id": string
      "url":string
      "locked": boolean,
      "repository": {
          "nameWithOwner": string
      }
  }
}
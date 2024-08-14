//Все запросы к api лежат здесь

export const SEARCH_REPO = `
query($query: String!) {
  search(query: $query, type: REPOSITORY, first: 40) {
    nodes {
      ... on Repository {
        name
        primaryLanguage {
          name
        }
        forkCount
        stargazers {
          totalCount
        }
        updatedAt
        languages(first: 5) {
          nodes {
            name
            color
          }
        }
        licenseInfo {
          name
        }
      }
    }
    pageInfo {
        endCursor
        hasNextPage
      }
  }
}
`

export const ADD_REPO = `
query($query: String!, $after: String!) {
  search(query: $query, type: REPOSITORY, first: 40, after: $after) {
    nodes {
      ... on Repository {
        name
        primaryLanguage {
          name
        }
        forkCount
        stargazers {
          totalCount
        }
        updatedAt
        languages(first: 5) {
          nodes {
            name
            color
          }
        }
        licenseInfo {
          name
        }
      }
    }
    pageInfo {
        endCursor
        hasNextPage
      }
  }
}
`
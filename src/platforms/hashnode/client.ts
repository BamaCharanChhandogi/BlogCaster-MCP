const HASHNODE_ENDPOINT = "https://gql.hashnode.com/graphql";

export async function callHashnode(
	query: string,
	variables: any,
	token: string,
) {
	const res = await fetch(HASHNODE_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ query, variables }),
	});

	const data = await res.json() as { errors?: any[]; data?: any };
	if (data.errors) throw new Error(JSON.stringify(data.errors, null, 2));
	return data.data;
}

export async function getPublicationId(token: string) {
	const query = `
    query {
      me {
        publications(first: 10) {
          edges { node { id } }
        }
      }
    }
  `;
	const data = await callHashnode(query, {}, token);
	return data.me.publications.edges[0]?.node?.id || null;
}

export async function getAllBlogs(token: string, fetchPublicationCountQueryLimit: number) {
	const pubsQuery = `
  query {
	me {
	  publications(first: ${fetchPublicationCountQueryLimit}) {
		edges {
		  node {
			url
		  }
		}
	  }
	}
  }
  `;
	const pubsData = await callHashnode(pubsQuery, {}, token);
	const publications = pubsData?.me?.publications?.edges || [];
  
	const postsList: { id: string; url: string; title: string; slug?: string; }[] = [];
  
	for (const pubEdge of publications) {
	  const pubUrl = pubEdge?.node?.url;
	  if (!pubUrl) continue;
  
	  let host: string | null = null;
	  try {
		host = new URL(pubUrl).host;
	  } catch {
		continue;
	  }
  
	  const postsQuery = `
  query {
	publication(host: "${host}") {
	  posts(first: ${fetchPublicationCountQueryLimit}) {
		edges {
		  node {
			id
			url
			title
		  }
		}
	  }
	}
  }
  `;
	  const postsData = await callHashnode(postsQuery, {}, token);
	  const posts = postsData?.publication?.posts?.edges || [];
  
	  for (const p of posts) {		
		if (p?.node?.id) {
		  let slug: string | undefined;
		  try {
			if (p.node.url) {
			  const urlObj = new URL(p.node.url);
			  const segments = urlObj.pathname.split("/").filter(Boolean);
			  slug = segments.pop();
			}
		  } catch {
			// ignore slug extraction errors
		  }

		  postsList.push({
			id: p.node.id,
			url: p.node.url,
			title: p.node.title,
			slug,
		  });
		}
	  }
	}
  
	return postsList;
  }
  
export async function deletePublicationStory(
	token: string,
	publicationId: string,
	slug: string,
) {
	const mutation = `
mutation DeletePublicationStory($publicationId: ID!, $slug: String!) {
  deletePublicationStory(publicationId: $publicationId, slug: $slug) {
    success
  }
}
`;
	const variables = { publicationId, slug };
	const data = await callHashnode(mutation, variables, token);
	const success = data?.deletePublicationStory?.success;
	if (!success) {
		throw new Error("Hashnode delete failed");
	}
}
  
export async function createDraft(
	token: string,
	title: string,
	contentMarkdown: string,
	publicationId: string,
) {
	const query = `
    mutation CreateDraft($input: CreateDraftInput!) {
      createDraft(input: $input) {
        draft { id title slug }
      }
    }
  `;
	const variables = { input: { title, contentMarkdown, publicationId } };
	const data = await callHashnode(query, variables, token);
	return data.createDraft.draft;
}

export async function publishDraft(token: string, draftId: string) {
	const query = `
    mutation PublishDraft($input: PublishDraftInput!) {
      publishDraft(input: $input) {
        post { id title slug url publishedAt }
      }
    }
  `;
	const variables = { input: { draftId } };
	const data = await callHashnode(query, variables, token);
	return data.publishDraft.post;
}


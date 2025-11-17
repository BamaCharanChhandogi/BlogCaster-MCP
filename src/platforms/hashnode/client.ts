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

	const data = await res.json();
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


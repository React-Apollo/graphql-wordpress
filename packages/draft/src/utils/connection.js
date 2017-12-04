import { base64DecodeUnicode, base64EncodeUnicode } from 'utils/base64';

const PREFIX = 'arrayconnection:';

export function cursorToOffset(cursor) {
  return parseInt(base64DecodeUnicode(cursor).substring(PREFIX.length), 10);
}

export function offsetToCursor(offset) {
  return base64EncodeUnicode(PREFIX + offset);
}

export function bindLoadMore(prop) {
  return e => {
    e.preventDefault();

    const { fetchMore, variables } = this.props.data;

    const data = this.props.data[prop];

    return fetchMore({
      variables: {
        ...variables,
        after: data.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const mergedResult = {
          ...fetchMoreResult,
          [prop]: {
            ...fetchMoreResult[prop],
            edges: previousResult[prop].edges.concat(fetchMoreResult[prop].edges),
          },
        };

        return mergedResult;
      },
    });
  };
}

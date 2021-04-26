function handleResponse(res) {
  return res.json();
}

function ajax() {
  const apiUrl = 'https://jsonplaceholder.typicode.com';

  const promise = fetch(`${apiUrl}/albums`);

  promise.then(handleResponse).then((albums) => {
    const userPromises = [];
    for (const album of albums) {
      const uPr = fetch(`${apiUrl}/users/${album.userId}`)
        .then(handleResponse)
        .then((user) => {
          album.user = user.username;
        });

      userPromises.push(uPr);
    }

    Promise.all(userPromises).then(() => buildAlbumHtml(albums));
  });

  function buildAlbumHtml(albums) {
    const fragment = document.createDocumentFragment();
    for (const album of albums) {
      const albumElem = document.createElement('dl');
      const titleElem = document.createElement('dt');
      const authorElem = document.createElement('dd');

      titleElem.innerText = album.title;
      // authorElem.innerText = album.userId;

      authorElem.innerText = '-' + album.user;
      albumElem.appendChild(titleElem);
      albumElem.appendChild(authorElem);

      fragment.appendChild(albumElem);
    }

    document.getElementById('albums').appendChild(fragment);
  }
}

ajax();

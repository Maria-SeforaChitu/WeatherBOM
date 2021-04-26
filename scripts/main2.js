function handleResponse(res) {
  return res.json();
}

function ajax() {
  const apiUrl = 'https://jsonplaceholder.typicode.com';

  const promise = fetch(`${apiUrl}/albums`);
  promise.then(handleResponse).then(buildAlbumHtml);

  function buildAlbumHtml(albums) {
    const fragment = document.createDocumentFragment();
    for (const album of albums) {
      const albumElem = document.createElement('dl');
      const titleElem = document.createElement('dt');
      const authorElem = document.createElement('dd');

      titleElem.innerText = album.title;
      // authorElem.innerText = album.userId;
      fetch(`${apiUrl}/users/${album.userId}`)
        .then(handleResponse)
        .then((user) => {
          authorElem.innerText = '-' + user.username;
        });

      albumElem.appendChild(titleElem);
      albumElem.appendChild(authorElem);

      fragment.appendChild(albumElem);
    }

    document.getElementById('albums').appendChild(fragment);
  }
}

ajax();

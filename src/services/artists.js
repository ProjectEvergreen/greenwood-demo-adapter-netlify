async function getArtists(offset = 0, limit = 5) {
  const artists = (await fetch(`https://www.analogstudios.net/api/artists`)
    .then(resp => resp.json()))
    .slice(offset, offset + limit);

  return artists;
}

export { getArtists };
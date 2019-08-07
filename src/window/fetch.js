// istanbul ignore file until we figure out a mockserver or mockfetch solution
module.exports = function(win) {
  win.fetch.latest = function(url) {
    return fetch(url, {
      method: 'GET',
      cache: 'no-cache'
    });
  };

  win.fetch.latest.json = url => {
    return win.fetch.latest(url).then(function(response) {
      return response.json();
    });
  };

  win.fetch.post = (url, data) => {
    return win.fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json());
  };

  // @TODO: fetch.cached(2..days()).text()
};

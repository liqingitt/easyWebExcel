setInterval(() => {
  self.postMessage({
    type: 'calcColPostionWork',
    data: 111
  });
}, 1000);
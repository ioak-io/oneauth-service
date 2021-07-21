module.exports = function (router: any) {
  router.get("/hello", (_: any, res: any) => {
    res.send(
      "basic connection to server works. database connection is not validated"
    );
    res.end();
  });
};

module.exports = {
  networks: {
    development: {
      privateKey: 'ee3572e2f996a296758788936b4c936b3cdf8c952ab1ce74134965f42c7cbfa1',
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      fullNode: "http://127.0.0.1:9090",
      solidityNode: "http://127.0.0.1:8091",
      eventServer: "http://127.0.0.1:8092",
      network_id: "*"
    },
    shasta: {
      privateKey: '59ae31a6e38840980c8e3dc13f6c1ad2da719e9e1d6f4258ae145a9d1cc122bf',
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      fullNode: "https://api.shasta.trongrid.io",
      solidityNode: "https://api.shasta.trongrid.io",
      eventServer: "https://api.shasta.trongrid.io",
      network_id: "*"
    },
    mainnet: {
      privateKey: process.env.PK,
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      fullNode: "https://api.trongrid.io",
      solidityNode: "https://api.trongrid.io",
      eventServer: "https://api.trongrid.io",
      network_id: "*"
    }
  }
};

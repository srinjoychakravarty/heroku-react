import React from 'react';
import TronWeb from 'tronweb';
import TronLinkGuide from 'components/TronLinkGuide';
import Utils from 'utils';
import Swal from 'sweetalert2';
import './App.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';
const CONTRACT_ADDRESS = 'TWAAJowwzmtYjJh6Q33GF7Q7wi2BAND1fV';
const INDCA_TOKEN_ID = 1001009;
const SATVA_TOKEN_ID = 1001010;
const LEAF_TOKEN_ID = 1001864;
const SEED_TOKEN_ID = 1000001;
const TERC_TOKEN_ID = 1000226;
const LOCT_TOKEN_ID = 1000604;
const MMT_TOKEN_ID = 1001071;
const ACTIV_TOKEN_ID = 1002171;
const KIWI_TOKEN_ID = 1001050;
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            gettrxINDCAamount: 0,
            gettrxSATVAamount: 0,
            gettrxLEAFamount: 0,
            gettrxSEEDamount: 0,
            gettrxTERCamount: 0,
            gettrxLOCTamount: 0,
            gettrxMMTamount: 0,
            gettrxACTIVamount: 0,
            gettrxKIWIamount: 0,
            address: '',
            INDCAcontractbalance:0,
            SATVAcontractbalance:0,
            LEAFcontractbalance:0,
            SEEDcontractbalance:0,
            TRECcontractbalance:0,
            LOCTcontractbalance:0,
            MMTcontractbalance:0,
            ACTIVcontractbalance:0,
            KIWIcontractbalance:0,
            TRXcontractbalance:0,
            newowner:'',
            deposittrxvalue:0,
            withdrawtrxaddress:'',
            withdrawtrxamount:0,

              tronWeb: {
                  installed: false,
                  loggedIn: false
              },
            }
        this.updateINDCAValue = this.updateINDCAValue.bind(this)
        this.updateSATVAValue = this.updateSATVAValue.bind(this)
        this.updateLEAFValue = this.updateLEAFValue.bind(this)
        this.updateSEEDValue = this.updateSEEDValue.bind(this)
        this.updateTERCValue = this.updateTERCValue.bind(this)
        this.updateLOCTValue = this.updateLOCTValue.bind(this)
        this.updateMMTValue = this.updateMMTValue.bind(this)
        this.updateACTIVValue = this.updateACTIVValue.bind(this)
        this.updateKIWIValue = this.updateKIWIValue.bind(this)
        this.updateWithdrawTRXAddressValue = this.updateWithdrawTRXAddressValue.bind(this)
        this.updateWithdrawTRXAmountValue = this.updateWithdrawTRXAmountValue.bind(this)
        this.updateDepositTRXValue = this.updateDepositTRXValue.bind(this)
        this.updateTransferOwnershipValue = this.updateTransferOwnershipValue.bind(this)

    }

    async componentDidMount() {

        this.setState({loading:true})
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';

                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if(!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState,
                    contractAddress: CONTRACT_ADDRESS,
                });
                resolve();
            }, 100);
        });

        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', () => {
                if(this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb, CONTRACT_ADDRESS);

        this.setState({
            address : Utils.tronWeb.address.fromHex((((await Utils.tronWeb.trx.getAccount()).address).toString())),
            INDCAcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(INDCA_TOKEN_ID).call()).toString()),
            SATVAcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(SATVA_TOKEN_ID).call()).toString()),
            LEAFcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(LEAF_TOKEN_ID).call()).toString()),
            SEEDcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(SEED_TOKEN_ID).call()).toString()),
            TERCcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(TERC_TOKEN_ID).call()).toString()),
            LOCTcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(LOCT_TOKEN_ID).call()).toString()),
            MMTcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(MMT_TOKEN_ID).call()).toString()),
            ACTIVcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(ACTIV_TOKEN_ID).call()).toString()),
            KIWIcontractbalance : parseFloat((await Utils.contract.getTRC10TokenBalance(KIWI_TOKEN_ID).call()).toString()),
            TRXcontractbalance : parseFloat((await Utils.contract.getBalance().call()).toString())/1000000,

        });

        //await Utils.setTronWeb(window.tronWeb);
        //console.log(Utils.tronWeb.address.fromHex((((await Utils.tronWeb.trx.getAccount()).address).toString())));  /////// Get account address and info
        console.log(Utils.contract);
    }

    /////////////////////////////////////// SwapTRXINDCA /////////////////////////////////
    async SwapTRXINDCA(_amount){

        Utils.contract.OneToOneSwapTRC10(this.state.address, INDCA_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateINDCAValue (evt) {
        console.log('gettrxINDCAamount : ', this.state.gettrxINDCAamount);
            this.setState({
              gettrxINDCAamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXINDCA /////////////////////////////////

    /////////////////////////////////////// SwapTRXSATVA /////////////////////////////////
    async SwapTRXSATVA(_amount){

        Utils.contract.OneToOneSwapTRC10(this.state.address, SATVA_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateSATVAValue (evt) {
        console.log('gettrxSATVAamount : ', this.state.gettrxSATVAamount);
            this.setState({
              gettrxSATVAamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXSATVA /////////////////////////////////

    /////////////////////////////////////// SwapTRXLEAF /////////////////////////////////
    async SwapTRXLEAF(_amount){

        Utils.contract.TwoToOneSwapTRC10(this.state.address, LEAF_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount*2)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateLEAFValue (evt) {
        console.log('gettrxLEAFamount : ', this.state.gettrxLEAFamount);
            this.setState({
              gettrxLEAFamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXLEAF /////////////////////////////////

    /////////////////////////////////////// SwapTRXSEED /////////////////////////////////
    async SwapTRXSEED(_amount){

        Utils.contract.FiveToOneSwapTRC10(this.state.address, SEED_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount*5)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateSEEDValue (evt) {
        console.log('gettrxSEEDamount : ', this.state.gettrxSEEDamount);
            this.setState({
              gettrxSEEDamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXSEED /////////////////////////////////

    /////////////////////////////////////// SwapTRXTERC /////////////////////////////////
    async SwapTRXTERC(_amount){

        Utils.contract.FiveToOneSwapTRC10(this.state.address, TERC_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount*5)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateTERCValue (evt) {
        console.log('gettrxTERCamount : ', this.state.gettrxTERCamount);
            this.setState({
              gettrxTERCamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXTERC /////////////////////////////////

    /////////////////////////////////////// SwapTRXLOCT /////////////////////////////////
    async SwapTRXLOCT(_amount){

        Utils.contract.FiveToOneSwapTRC10(this.state.address, LOCT_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount*5)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateLOCTValue (evt) {
        console.log('gettrxLOCTamount : ', this.state.gettrxLOCTamount);
            this.setState({
              gettrxLOCTamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXLOCT /////////////////////////////////

    /////////////////////////////////////// SwapTRXMMT /////////////////////////////////
    async SwapTRXMMT(_amount){

        Utils.contract.FiveToOneSwapTRC10(this.state.address, MMT_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount*5)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateMMTValue (evt) {
        console.log('gettrxMMTamount : ', this.state.gettrxMMTamount);
            this.setState({
              gettrxMMTamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXMMT /////////////////////////////////

    /////////////////////////////////////// SwapTRXACTIV /////////////////////////////////
    async SwapTRXACTIV(_amount){

        Utils.contract.FiveToOneSwapTRC10(this.state.address, ACTIV_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount*5)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateACTIVValue (evt) {
        console.log('gettrxACTIVamount : ', this.state.gettrxACTIVamount);
            this.setState({
              gettrxACTIVamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXACTIV /////////////////////////////////

    /////////////////////////////////////// SwapTRXKIWI /////////////////////////////////
    async SwapTRXKIWI(_amount){

        Utils.contract.FiveToOneSwapTRC10(this.state.address, KIWI_TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount*5)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateKIWIValue (evt) {
        console.log('gettrxKIWIamount : ', this.state.gettrxKIWIamount);
            this.setState({
              gettrxKIWIamount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXKIWI /////////////////////////////////

    /////////////////////////////////// withdrawTRX /////////////////////////////
    withdrawTRX(_address, _amount){

        Utils.contract.withdrawTRX(_address, _amount).send({
            shouldPollResponse: true,
            callValue: 0
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'

        }));

    }

    updateWithdrawTRXAmountValue (evt) {
        this.setState({
          withdrawtrxamount: evt.target.value
        });
    console.log('withdrawtrxamount : ', this.state.withdrawtrxamount);

    }

    updateWithdrawTRXAddressValue (evt) {
        this.setState({
          withdrawtrxaddress: evt.target.value
        });
    console.log('withdrawtrxaddress : ', this.state.withdrawtrxaddress);

    }
    /////////////////////////////////// withdrawTRX END /////////////////////////////

    /////////////////////////////////// depositTRX /////////////////////////////
    depositTRX(_amount){

        Utils.contract.depositTRX().send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'

        }));

    }

    updateDepositTRXValue (evt) {
        this.setState({
          deposittrxvalue: evt.target.value
        });
    console.log('deposittrxvalue : ', this.state.deposittrxvalue);

    }
    /////////////////////////////////// depositTRX END /////////////////////////////

    /////////////////////////////////// transferOwnership /////////////////////////////
    transferOwnership(_address){

        Utils.contract.transferOwnership(_address).send({
            shouldPollResponse: true,
            callValue: 0,
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'

        }));

    }

    updateTransferOwnershipValue (evt) {
        this.setState({
          newowner: evt.target.value
        });
    console.log('newowner : ', this.state.newowner);

    }
    /////////////////////////////////// transferOwnership END /////////////////////////////

    render() {
        if(!this.state.tronWeb.installed)
            return <TronLinkGuide />;

        if(!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed />;

        return (
              <div className='row'>
                <div className='col-lg-12 text-center' >
                  <hr/>

                  <h2 style={{color : 'red' }}>Crypto Cannabis Game Token ATM DApp</h2>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <br/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 INDCA Tokens in exchange with TRX for 1:1 ratio </h4>
                  <p> <i> Current TRC10 INDCA Supply in Smart Contract : {this.state.INDCAcontractbalance} </i></p>
                  <br/>
                  <p>Type number of INDCA tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxINDCAamount} onChange={this.updateINDCAValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXINDCA(this.state.gettrxINDCAamount)
                                                                     }  }>Swap TRX to INDCA
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 SATVA Tokens in exchange with TRX for 1:1 ratio </h4>
                  <p> <i> Current TRC10 SATVA Supply in Smart Contract : {this.state.SATVAcontractbalance} </i></p>
                  <br/>
                  <p>Type number of SATVA tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxSATVAamount} onChange={this.updateSATVAValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXSATVA(this.state.gettrxSATVAamount)
                                                                     }  }>Swap TRX to SATVA
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 LEAF Tokens in exchange with TRX for 2:1 ratio </h4>
                  <p> <i> Current TRC10 LEAF Supply in Smart Contract : {this.state.LEAFcontractbalance} </i></p>
                  <br/>
                  <p>Type number of LEAF tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxLEAFamount} onChange={this.updateLEAFValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXLEAF(this.state.gettrxLEAFamount)
                                                                     }  }>Swap TRX to LEAF
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 SEED Tokens in exchange with TRX for 5:1 ratio </h4>
                  <p> <i> Current TRC10 SEED Supply in Smart Contract : {this.state.SEEDcontractbalance} </i></p>
                  <br/>
                  <p>Type number of SEED tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxSEEDamount} onChange={this.updateSEEDValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXSEED(this.state.gettrxSEEDamount)
                                                                     }  }>Swap TRX to SEED
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 TERC Tokens in exchange with TRX for 5:1 ratio </h4>
                  <p> <i> Current TRC10 TERC Supply in Smart Contract : {this.state.TERCcontractbalance} </i></p>
                  <br/>
                  <p>Type number of TERC tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxTERCamount} onChange={this.updateTERCValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXTERC(this.state.gettrxTERCamount)
                                                                     }  }>Swap TRX to TERC
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 LOCT Tokens in exchange with TRX for 5:1 ratio </h4>
                  <p> <i> Current TRC10 LOCT Supply in Smart Contract : {this.state.LOCTcontractbalance} </i></p>
                  <br/>
                  <p>Type number of LOCT tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxLOCTamount} onChange={this.updateLOCTValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXLOCT(this.state.gettrxLOCTamount)
                                                                     }  }>Swap TRX to LOCT
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 MMT Tokens in exchange with TRX for 5:1 ratio </h4>
                  <p> <i> Current TRC10 MMT Supply in Smart Contract : {this.state.MMTcontractbalance} </i></p>
                  <br/>
                  <p>Type number of MMT tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxMMTamount} onChange={this.updateMMTValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXMMT(this.state.gettrxMMTamount)
                                                                     }  }>Swap TRX to MMT
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 ACTIV Tokens in exchange with TRX for 5:1 ratio </h4>
                  <p> <i> Current TRC10 ACTIV Supply in Smart Contract : {this.state.ACTIVcontractbalance} </i></p>
                  <br/>
                  <p>Type number of ACTIV tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxACTIVamount} onChange={this.updateACTIVValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXACTIV(this.state.gettrxACTIVamount)
                                                                     }  }>Swap TRX to ACTIV
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <br/>
                  <br/>
                  <h4> Get TRC10 KIWI Tokens in exchange with TRX for 5:1 ratio </h4>
                  <p> <i> Current TRC10 KIWI Supply in Smart Contract : {this.state.KIWIcontractbalance} </i></p>
                  <br/>
                  <p>Type number of KIWI tokens to exchange</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxKIWIamount} onChange={this.updateKIWIValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXKIWI(this.state.gettrxKIWIamount)
                                                                     }  }>Swap TRX to KIWI
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>

                  <hr style={{color: 'red', backgroundColor: 'red', height: 0.5}}/>
                  <p style={{color: 'red'}}> <i> *For Official Use Only </i></p>

                  <p> <i> Current TRX Supply in Smart Contract : {this.state.TRXcontractbalance} </i></p>

                  <br/>
                  <p> Address of transfer : </p>
                  <input style={{ width:"400px" }} value={this.state.withdrawtrxaddress} onChange={this.updateWithdrawTRXAddressValue}/>
                  <br/>
                  <br/>
                  <p> Amount to transfer from contract : </p>
                  <input style={{ width:"80px" }} value={this.state.withdrawtrxamount} onChange={this.updateWithdrawTRXAmountValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.withdrawTRX(this.state.withdrawtrxaddress, this.state.withdrawtrxamount)
                                                                     }  }>Withdraw
                  </button>
                  <br/>
                  <br/>

                  <br/>
                  <p> Amount to deposit in Smart Contract : </p>
                  <input style={{ width:"80px" }} value={this.state.deposittrxvalue} onChange={this.updateDepositTRXValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.depositTRX(this.state.deposittrxvalue)
                                                                     }  }>Deposit
                  </button>
                  <br/>
                  <br/>

                  <br/>
                  <p> Address of new Owner : </p>
                  <input style={{ width:"400px" }} value={this.state.newowner} onChange={this.updateTransferOwnershipValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.transferOwnership(this.state.newowner)
                                                                     }  }>Transfer Ownership
                  </button>
                  <br/>
                  <br/>
                  <hr style={{color: 'red', backgroundColor: 'red', height: 0.5}}/>

                  <br/>
                  <br/>
                </div>
              </div>
        );
    }
}

export default App;

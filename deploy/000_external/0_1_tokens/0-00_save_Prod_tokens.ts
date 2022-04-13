import 'dotenv/config';

import chalk from 'chalk';

import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {
  DeployFunction,
  DeploymentSubmission
} from 'hardhat-deploy/types';

import erc20abi from "../../../src/abis/external/erc20.json";
import wethabi from "../../../src/abis/external/weth.json";


import {
  utils,
} from 'ethers';

const { 
  formatUnits,
  parseEther,
  parseUnits
} = utils;

  
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy, getOrNull, log ,save } = deployments;
    const {
      deployer,
      weth,
      dai
    } = await getNamedAccounts();

    log(chalk.cyan(`.....`));
    log(chalk.cyan(`Starting Script.....`));
  
    log(`Saving contracts ....`);
  

    log(chalk.yellow(`Network Name: ${network.name}`));
    log("----------------------------------------------------");


    const wethSubmission : DeploymentSubmission = {
      abi: wethabi,
      address: weth
    }

    await save('TokenWETH', wethSubmission);
    let existingWETH = await getOrNull('TokenWETH');

    if(existingWETH) {
      log(`Deployment Saved: TokenWETH with address ${chalk.green(existingWETH.address)}`);
    }

    const daiSubmission : DeploymentSubmission = {
      abi: erc20abi,
      address: dai
    }

    await save('TokenDAI', daiSubmission);
    let existingDAI = await getOrNull('TokenDAI');

    if(existingDAI) {
      log(`Deployment Saved: TokenDAI with address ${chalk.green(existingDAI.address)}`);
    }



    log(chalk.cyan(`Ending Script.....`));
    log(chalk.cyan(`.....`));

    
  
}
export default func;
func.tags = ["0-1-00","0-1","token",'external'];

// func.skip = async (hre) => (await hre.deployments.getNetworkName()) == 'hardhat'; //skip when it is  hardhat
// func.skip = async () => true;


func.skip = async function (hre: HardhatRuntimeEnvironment) {


  //use for mainnet fork test,generate local host, or production

  //1) mainnet fork test    hre.network.name == 'hardhat' && isMainnetForking == true
  //2) generate local host  hre.network.name == 'localhost' && isMainnetForking == true
  //3) production           hre.network.name == 'bscMainnet' && isMainnetForking == false

 //not use for testnet, generate hardhat, unit test
  //1) testnet              hre.network.name == 'bscTestnet' && isMainnetForking == false
  //2) generate hardhat     hre.network.name == 'hardhat' && isMainnetForking == false
  //3) unit test            hre.network.name == 'hardhat' && isMainnetForking == false



  let isForking = process.env.HARDHAT_FORK == undefined ? false: true

  if( (hre.network.name == 'bsctestnet' && !isForking)
     || (hre.network.name == 'rinkeby' && !isForking) 
     || (hre.network.name == 'hardhat' && !isForking) ){
        return true;
    } else{
        return false;
    }


};
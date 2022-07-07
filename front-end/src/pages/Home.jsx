
import React, {useEffect, useState} from 'react'
import Footer from '../components/Footer'
import HeaderHome from '../components/HeaderHome'
import { NavLink, useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import { chains } from '../smart-contract/chains_constants';
const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");

const  CopyIcon = (props) => {
    const copyIconpath =  "M11.988 9.672c.015.249.276.418.487.285 1.315-.825 2.19-2.288 2.19-3.956a4.67 4.67 0 0 0-4.667-4.667c-1.667 0-3.131.875-3.956 2.19-.133.212.035.472.285.487 2.984.179 5.481 2.679 5.66 5.66zm-1.323.329a4.67 4.67 0 0 1-4.667 4.667 4.67 4.67 0 0 1-4.667-4.667 4.67 4.67 0 0 1 4.667-4.667 4.67 4.67 0 0 1 4.667 4.667z";
    const size = props.size ? props.size : 16;
    const fill = props.fill ? props.fill : "inherit";
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill={"#f00"}
        >
        <path d={copyIconpath}></path>
        </svg>
    );
}

export default function Home() {
    const [dropdown, setDropdown] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [ViewRequests, setViewRequests] = useState([]);
    const [copied, setCopied] = useState(false);
    const chainId = useSelector(state => state.auth.currentChainId);
    const account = useSelector(state => state.auth.currentWallet);
    const globalWeb3 = useSelector(state => state.auth.globalWeb3);
    const navigate = useNavigate();

    useEffect(() => {
        if(account && chainId && globalWeb3)
        {
            const getSummary = async () => {
                try{
                    const factory = new globalWeb3.eth.Contract(
                        CampaignFactory,
                        chains[chainId?.toString()].factoryAddress
                    );
                    if(factory)
                    {
                        let campaigns = await factory.methods.getDeployedCampaigns().call();
                        setCampaigns(campaigns);
                        const summary = await Promise.all(
                            campaigns.map((campaign, i) =>
                                new globalWeb3.eth.Contract(Campaign, campaigns[i]).methods.getSummary().call()
                            )
                        );                        
                        setViewRequests(summary);

                        console.log("[Home.jsx] campaigns = ", campaigns);
                        console.log("[Home.jsx] summary ", summary);
                    }
                }
                catch(e)
                {
                    console.error(e);
                }
            }
            getSummary();
        }
    }, [account, chainId, globalWeb3])

    const Category = [
        { name: 'See All' },
        { name: 'Defi' },
        { name: 'Education' },
        { name: 'Blockchain' },
        { name: 'Fintech' },
    ]

    const onCopyAddress = () =>
    {
      document.getElementById("hiddenAddressInput").select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => {
        setCopied(false)
      }, 2000);
    }

    return (
        <div>
            <HeaderHome />
            <section className="banner py-0 md:py-4">
                <div className="container">
                    <div className="left md:w-7/12 w-9/12 sm:pl-12 pl-6 pr-3">
                        <h1 className='text-white mb-3 md:mb-5 text-xl md:text-xl lg:text-4xl xl:text-4.5xl font-semibold'>A Layer 2 crowdfunding <br /> platform created by <br /> you, for everyone.</h1>
                        <NavLink to='/create-campaign' className='createbtn sm:px-4 px-2 text-xs sm:text-xs md:text-lg py-2 pb-3'>Create Campaign</NavLink>
                    </div>
                </div>
            </section>
           
            <section className="main-home py-5 pb-12">
                <div className="container">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className='text-xl font-bold dark:text-gray-100'>Open Campaigns</h2>
                        <div className='hidden md:flex flex-wrap items-start'>
                            <div className="py-2 px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 mb-2 md:mb-0">See All</div>
                            <div className="relative">
                                <button className="sm:ml-3 ml-0 py-2 px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 flex items-center justify-between" type="button" onClick={() => {setDropdown(!dropdown)}}>Categories
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
                                {/* <!-- Dropdown menu --> */}
                                { dropdown ? <>
                                    <div id="dropdown" className="absolute  top-12 right-0 z-10 bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                                    {Category.map((i, index) => (
                                        <li key={index}>
                                            <a href="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{i.name}</a>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                                </> : ''}
                            </div>
                        </div>
                    </div>
                    <div className="md:hidden flex flex-wrap gap-2 items-center my-10">
                        {Category.map((i, index) => (
                            <div className='px-2' key={index}>
                                <div className="block text-center py-2 px-4 sm:px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap">{i.name}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 ">
                        {ViewRequests && ViewRequests.length>0 && ViewRequests.map((data, index) => (
                            <div className='bg-white px-2 md:px-6 pt-4 md:pt-12 pb-8' key={index} >
                                <div className="flex flex-wrap md:justify-between">
                                    <h5 className='value text-lg'>{campaigns[index]?.toString()?.substring(0, 8)+"..."}</h5>
                                    <div>
                                        <button className='bg-blue-light small-text font-normal px-2 text-xs py-1 mr-3'>B2C</button>
                                        <button className='bg-blue-light small-text font-normal text-xs py-1 px-2'>CPG</button>
                                    </div>
                                </div>
                                <div className="image relative my-4">
                                    <img src={data[7]} alt="item" className="rounded-lg my-3 w-full" />
                                    {
                                        data[9] === true ? 
                                        <img src="/images/tick.png" alt="tick" className='absolute right-5 top-5' />
                                        :<></>
                                    }
                                </div>
                                <div className="body">
                                    <div className="flex flex-wrap md:justify-between"  >
                                        <h4 className='text-blue text-sm title mb-3 '>{data[5]}</h4>
                                        <div style={{display: "flex", flexWrap:"wrap", flexDirection:"row", 
                                                cursor:"pointer", 
                                                userSelect:"none" }} onClick={() => onCopyAddress()} >
                                        <img src="/images/share-button-svgrepo-com.svg"                                                 
                                            style={{
                                                width: "16px", 
                                                height: "16px",  
                                                marginTop: "2px"}} alt="tick" 
                                        />      
                                        {
                                            copied ? <span className='text-blue' >Copied</span> : <span className='text-blue' >Share{" "}</span>
                                        }    
                                        </div>                             
                                        <input type="text" id="hiddenAddressInput" 
                                            style={{ height:"0px", opacity:"0"}} 
                                            value={`${window.location.protocol}//${window.location.host}/campaign/${campaigns[index]}`} 
                                        />                
                                    </div>
                                    <p className='text-blue description mb-3'>{data[6]}</p>
                                    <p className='para'>{"Raised"}</p>
                                    <h6 className='content mb-5 mt-1 text-sm'>{globalWeb3?.utils.fromWei(data[1], "ether") || 0}</h6>
                                    <NavLink to={`/campaign/${campaigns[index]}`} className="py-2 donatebtn px-4 md:px-12 text-md leading-5 text-black bg-gradient-secondary font-bold">
                                        Donate
                                    </NavLink>     
                                </div>              
                            </div>
                        ))}
                    </div>
                </div>
            </section>
           
            <Footer />

        </div>
    )
}

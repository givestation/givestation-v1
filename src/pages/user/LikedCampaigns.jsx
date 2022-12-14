import React from "react";
import LikeCampImg from "./assets/likeCampImg.svg";
import HeartIcon from "./assets/heart.svg";
import HeartBlankIcon from "./assets/heart-blank.svg";
import Kemono from "./assets/Kemono.svg";
import { useNavigate } from "react-router";
import {NotificationManager} from "react-notifications";
import UserFooter from "../../components/user/UserFooter";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { backendURL } from "../../config";

const LikedCampaigns = () => {
  const chainId = useSelector(state => state.auth.currentChainId);
  const account = useSelector(state => state.auth.currentWallet);
  const globalWeb3 = useSelector(state => state.auth.globalWeb3);
  const [likesInfo, setLikesInfo] = useState([]);
  const navigate = useNavigate();
  const [ip, setIP] = useState('');

  const getLocationData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/');
    setIP(res.data.IPv4)
  }

  useEffect(() => {
    getLocationData();
  }, [])

  const getLikesInfo = async () => {
      await axios({
        method: "post",
        url: `${backendURL}/api/likes/getAllLikedCampaigns`,
        data: {
            user: ip || "",
            chainId:chainId || ""
        }
      }).then((res)=>{
          if(res.data && res.data.code === 0)
          {
            setLikesInfo(res.data.data);
          }
      }).catch((err)=> {
          console.error(err);    
      });
  }

  useEffect(()=>{
    getLikesInfo();
  }, [globalWeb3, account])

  const onClickFavorites = async (idOnDB, val) => {
      await axios({
        method: "post",
        url: `${backendURL}/api/likes/set`,
        data: {
            campaign: idOnDB,
            user: ip || "",
            value: val
        }
      }).then((res)=>{
          if(res.data && res.data.code === 0)
          {
            getLikesInfo();
          }
      }).catch((err)=> {
          console.error(err);    
      });
  }

  return (
    <div className="py-20 px-10 wholeWrapper">
      <div className="flex items-center pageHead">
        <h1 className="text-slate-900 dark:text-white font-bold overview">Liked Campaigns</h1>
          <div className="accountNo ml-7" style={{textAlign:"center"}}>
            {account && <h2>{account.toString().substring(0, 6)+"..."+account.toString().substring(38, 42)}</h2>}
        </div>
      </div>

      <div className="mt-14 flex justify-center items-center flex-col">
      {
          likesInfo.length>0 && 
          likesInfo.map((item, index) => (
            <div className="flex likeCard" key={index} >
              <div className="flex w-3/4 likeDesc">
                <img src={item?.campaign? `${backendURL}/${item.campaign?.imageURL}` : LikeCampImg} 
                  alt=""                   
                  style={{ width:"348px", height:"200px"}}
                />
                <div className="likeCardDetail w-1/2">
                  <h6 className="flex">
                    {item?.campaign? item.campaign?.name : ""}
                    {/* <img src={Kemono} alt="" style={{ marginLeft: 5 }} /> */}
                  </h6>
                  <p>
                  {
                    item.campaign?.description
                  }
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center w-1/4 likeBtns" style={{ userSelect:"none", cursor:"pointer" }}>
                {
                  item.value===true && <img src={HeartIcon} alt="" onClick={()=>{ onClickFavorites(item.campaign?._id, false) }} />
                }
                {
                  item.value===false && <img src={HeartBlankIcon} alt="" onClick={()=>{ onClickFavorites(item.campaign?._id, true) }} />
                }
                <h4 onClick={() => { navigate(`/campaign/${item.campaign?.address}`) }}
                >view grant</h4>
              </div>
            </div>
          ))
        }
      </div>
      <UserFooter  style={{ backgroundColor:"transparent" }} />
    </div>
  );
};

export default LikedCampaigns;

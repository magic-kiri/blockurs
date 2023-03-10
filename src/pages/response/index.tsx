import styles from './page.module.css';
import { useState, useEffect } from "react";
import { Divider, Tooltip } from 'antd';
import { apiCall } from "../../../public/apiCall";
import Cookies from "js-cookie";
import { scoreResponseQuery } from "../../../public/query";
import { HomeOutlined, LogoutOutlined, NotificationOutlined } from '@ant-design/icons';
import Router from "next/router";

type response = {
  index: number;
  verdict: string,
  us: boolean,
  fs: boolean,
  es: boolean,
  querier: string,
  responder?: string,
  responderName: string,
  values: {
    verdict: string,
    uscore?: number,
    fscore?: number,
    escore?: number
  }
}


type scoreRequest = {
  index: number;
  querier: string;
  responder: string;
  us: boolean;
  fs: boolean;
  es: boolean;
  User: {
    name: string;
    index: number;
    identifier: string;
  };
  userByResponder: {
    name: string;
    index: number;
    identifier: string;
  }
  response:string
};

export default function Home() {
  // const [name, setName] = useState<String>("Aia Lemonsky");
  const [responses, setResponses] = useState<response[]>([])

  useEffect(()=>{
    //@ts-ignore
    const { identifier } = JSON.parse(Cookies.get("loginCookie"));
    const fetchScoreResponses = async () => {
      const { data } = await apiCall(scoreResponseQuery, { _eq: identifier });
      const requests: scoreRequest[] = data.Request
      const filteredRequests = requests.map((req)=>{
        const obj:response = JSON.parse(JSON.stringify(req));
        obj.responderName = req.userByResponder.name


        const response = JSON.parse(req.response)
        obj.verdict = response.verdict;
        // console.log({response});

        if(response.verdict === "Accepted")
        obj.values = JSON.parse(JSON.stringify((response.values)));
        // console.log(obj)
        return obj
      })
      console.log(filteredRequests);
      setResponses(filteredRequests);
    };
    fetchScoreResponses();
  },[]);

  const options = responses.map(
    (res) =>
    {
      if(res.verdict=="Accepted") {
        return(
          <div className={styles.accepted}>
            <p><b>{res.responderName}</b> has accepted your request to know their Reputation Scores!</p>
            <Divider orientation="center" plain style={{margin: "10px"}}>
              <b> Scores </b>
            </Divider>

            {res.us ? (
              <div>
                Unified Score: {Math.round(res.values.uscore)}
              </div> 
            ) : (
              <>  </>
            )}

            {res.fs ? (
              <div>
                Financial Score: {Math.round(res.values.fscore)}
              </div> 
            ) : (
              <>  </>
            )}

            {res.es ? (
              <div>
                E-commerce Score: {Math.round(res.values.escore)}
              </div> 
            ) : (
              <>  </>
            )}

          </div>
        )
      }
      else if(res.verdict=="Pending") {
          return(
            <div className={styles.pending}>
              <p><b>{res.responderName}</b> has not yet responded to your request of knowing their Reputation Scores. Please wait for acceptance.</p>
              <Divider orientation="center" plain style={{margin: "10px"}}>
                <b> Requested Scores </b>
              </Divider>

            {res.us ? (
              <div>
                Unified Score 
              </div> 
            ) : (
              <>  </>
            )}

            {res.fs ? (
              <div>
                Financial Score 
              </div> 
            ) : (
              <>  </>
            )}

            {res.es ? (
              <div>
                E-commerce Score 
              </div> 
            ) : (
              <>  </>
            )}

            </div>
            
          )
      } else {
          return(
            <div className={styles.rejected}>
              <p><b>{res.responderName}</b> has rejected yor request to know their Reputation Score.</p>
              <Divider orientation="center" plain style={{margin: "10px"}}>
                <b> Requested Scores </b>
              </Divider>

            {res.us ? (
              <div>
                Unified Score
              </div> 
            ) : (
              <>  </>
            )}

            {res.fs ? (
              <div>
                Financial Score
              </div> 
            ) : (
              <>  </>
            )}

            {res.es ? (
              <div>
                E-commerce Score
              </div> 
            ) : (
              <>  </>
            )}

            </div>
          )
      }
    }
  );

  return (
      <div className={styles.main}>
        <div className={styles.top}>
          <h3 className={styles.heading}>Responses of Your Requests</h3>

          <Tooltip title="Home">
          <HomeOutlined
            className={styles.icon}
            onClick={() => Router.push("/score")}
          />
          </Tooltip>

          <Tooltip title="Log Out">
          <LogoutOutlined
            className={styles.icon}
            onClick={() => Router.push("/")}
          />
          </Tooltip>
        </div>
        {options}

      </div>
  )
}

using OpenTokSDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace videoChat.Models
{
    internal class Constant
    {
        public static int ApiKey = 46135162; // YOUR API KEY
        public static string ApiSecret = "394a7b9d03e52ae2485bfd589d1d8733e220157b";

        OpenTok penTok = new OpenTok(ApiKey, ApiSecret);

        
        // (optional) add server code here
    }
}
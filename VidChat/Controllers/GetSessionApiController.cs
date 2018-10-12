using System;
using System.Linq;
using System.Web.Http;
using videoChat.Models;
using videoChat.Views.Models;
using System.Web.Http.Cors;
using VidChat.Models;
using OpenTokSDK;

namespace videoChat.Controllers
{
    [EnableCors("*", "*", "*"),RoutePrefix("api")]
    public class GetSessionApiController : ApiController
    {

       static int ApiKey = 46200612; // YOUR API KEY
        static string ApiSecret = "efa594b7b7aec05bba6c9cd897c977c787e5629d";
       
        OpenTok penTok = new OpenTok(ApiKey, ApiSecret);

        //The Model Passed here requires two Id'd
        //The Caller's id as well as the Receivers Id
        [Route("InitiateCall"), HttpPost]
        public IHttpActionResult IntiateCall(CallerViewModel data)
        {
            using (var ctx = new TelemedicineDBEntities())
            {
                var caller = ctx.Users
                    .Where(a => a.UserId == data.CallerId)
                    .FirstOrDefault();
                if (caller.UserId != null)
                {
                    try
                    {
                        DateTime serverTime = DateTime.Now;
                        Console.WriteLine(serverTime);
                        var session = penTok.CreateSession();
                        var token = session.GenerateToken();

                        var callInfo = ctx.callInfoes.Add(new callInfo
                        {
                            CallInfoId = Guid.NewGuid(),
                            CallerId = data.CallerId,
                            ReceiverId = data.ReceiverId,
                            SessionId = session.Id,
                            Token = token
                        });

                        var newInfo = new callInfo();
                        newInfo.CallerId = callInfo.CallerId;
                        newInfo.ReceiverId = callInfo.CallerId;
                        newInfo.SessionId = callInfo.SessionId;
                        newInfo.CallInfoId = callInfo.CallInfoId;
                        newInfo.Token = callInfo.Token;

                        var result = ctx.SaveChanges();
                        if (result == 1)
                            return Ok(newInfo);
                        else
                            return Ok("Call failed");
                    }
                    catch (Exception ex)
                    {
                        throw ex.InnerException;
                    }
                }
            }

            return Ok();
        }


        //The Id passed here is the Receiver's Id
        [Route("PickCall/{id}"), HttpPost]
        public IHttpActionResult PickCall(Guid id)
        {
            using (var ctx = new TelemedicineDBEntities())
            {
                var PickCall = ctx.callInfoes
                    .Where(a => a.ReceiverId == id)
                    .FirstOrDefault();
                if (PickCall != null)
                {
                    try
                    {
                        PickCall.TimeCallPicked = DateTime.Now;
                        var callInfo = ctx.CallHistories.Add(new CallHistory
                        { 
                            CallHistoryId = Guid.NewGuid(),
                            CallerId = PickCall.CallerId.ToString(),
                            ReceiverId = PickCall.ReceiverId.ToString(),
                            TimeCallBegan = DateTime.Now,
                            CallInfoId = PickCall.CallInfoId
                            
                        });
                        var result =  ctx.SaveChanges();
                        if (result > 0) {
                            var newDetails = (from m in ctx.callInfoes
                                              where id == m.ReceiverId
                                              join n in ctx.CallHistories on m.CallInfoId equals n.CallInfoId
                                              select new {
                                                  n.CallHistoryId,
                                                  n.CallerId,
                                                  n.CallInfoId,
                                                  n.ReceiverId,
                                                  n.TimeCallBegan,
                                                  m.SessionId,
                                                  m.Token
                                              }).SingleOrDefault();

                            return Ok(newDetails);
                        }
                       
                        else
                            return Ok("Call failed");
                    }
                    catch (Exception ex)
                    {
                        throw ex.InnerException;
                    }
                }
            }

            return Ok();
        }

        //The Id passed here is either the Caller's Id or the Receiver's Id
        [Route("EndCall/{id}"), HttpPost]
        public IHttpActionResult EndCall(Guid id)
        {
            try
            {
                using (var ctx = new TelemedicineDBEntities())
                {
                var EndCall = ctx.callInfoes
                    .Where(a => a.ReceiverId == id || a.CallerId == id)
                    .FirstOrDefault();
                    if (EndCall != null)
                    {
                        //var updateCallHistory = ctx.CallHistories.Where(a => a.CallInfoId == EndCall.CallInfoId).FirstOrDefault();
                        //updateCallHistory.TimeCallEnded = DateTime.Now;

                        ctx.callInfoes.Remove(EndCall);

                        var result = ctx.SaveChanges();




                        return result > 0 ? Ok("Call Ended") : Ok("Call Not Ended");



                    }
                }
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }

            return Ok("Incorrect Id");
        }
      
        
        //The Id passed here is the Receiver Id 
        [Route("IsCallPicked/{id}"), HttpPost]
        public IHttpActionResult IsCallPicked(Guid id)
        {
            using (var ctx = new TelemedicineDBEntities())
            {
                var recId = ctx.callInfoes
                    .Where(a => a.ReceiverId == id)
                    .FirstOrDefault();
                if (recId.TimeCallPicked != null)
                {
                    try
                    {

                        var call = (from receiver in ctx.callInfoes
                                    where receiver.ReceiverId == id
                                    join callHistory in ctx.CallHistories on receiver.ReceiverId.ToString() equals callHistory.ReceiverId
                                    select new {
                                        receiver.CallerId,
                                        receiver.Token,
                                        receiver.SessionId,
                                        callHistory.TimeCallBegan
                                    }).SingleOrDefault();
                        

                        if (call !=null)
                        {
                           
                            return Ok(call);
                        }
                        else
                            return Ok("Call Has not been picked for this User");
                    }
                    catch (Exception ex)
                    {
                        throw ex.InnerException;
                    }
                }
            }

            return Ok("Incorrect Id");
        }

        //The Id passed here is the CallInfoId 
        // it returnds true if the call has been ended "else" it returns false
        [Route("IsCallEnded/{id}"), HttpPost]
        public IHttpActionResult IsCallEnded(Guid id)
        {
            try
            {
                using (var ctx = new TelemedicineDBEntities())
                {
                    var recId = ctx.callInfoes
                        .Where(a => a.CallInfoId == id)
                        .FirstOrDefault();
                    var checkCallHistory = (from u in ctx.CallHistories
                                            where recId.CallInfoId == id
                                            select new { u.TimeCallEnded });

                    return recId == null && checkCallHistory != null ? Ok(true) : Ok(false);

                }
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }

           
        }
    }
}

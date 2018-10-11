using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using VidChat.Models;


namespace videoChat.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api")]
    public class UserController : ApiController
    {
        [Route("getUserProfile/{id}"), HttpGet]
        public IHttpActionResult GetUserProfile(Guid id)
        {
            try
            {
                using (var ctx = new TelemedicineDBEntities())
                {
                    var user = (from u in ctx.Users
                                where u.UserId == id
                                select new
                                {u.LastName_,
                                u.FirstName,
                                    u.Email}).FirstOrDefault();
                    if (user == null)
                        return Ok("User with " + id + " id doesn't exist");
                    else
                        return Ok(user);
                }
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
          
        }

        [Route("IsUserAvailable/{id}"), HttpGet]
        public IHttpActionResult IsUserAvailable(Guid id)
        {
            try
            {
                using (var ctx = new TelemedicineDBEntities())
                {
                    var user = (from u in ctx.loggedUsers
                                where u.userId == id
                                select new { u.email }).Any();

                    var CallInfo = (from u in ctx.callInfoes
                                    where u.ReceiverId == id && u.TimeCallPicked == null
                                    join r in ctx.Users on u.ReceiverId equals r.UserId
                                    join c in ctx.Users on u.CallerId equals c.UserId
                                    select new {
                                        r.FirstName,
                                        r.LastName_,
                                        r.Email,
                                        u.ReceiverId,
                                        u.SessionId,
                                        u.Token,
                                        CallerId = u.CallerId,
                                        CallerName = c.FirstName +" " +c.LastName_ })
                                        .FirstOrDefault();

                    if (user == false || CallInfo == null)
                        return Ok("User isn't available");
                    else
                        return Ok(CallInfo);
                }
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }

        }

        [Route("AllUsers/{id}"), HttpGet]
        public IHttpActionResult AllUsers(Guid id)
        {
            try
            {
                using (var ctx = new TelemedicineDBEntities())
                {
                    var CallInfo = (from u in ctx.Users 
                                    where u.UserId != id
                                    select new { u.FirstName, u.LastName_, u.Email, u.UserId }).ToList();
                    if (CallInfo == null)
                        return Ok("User isn't available");
                    else
                        return Ok(CallInfo);
                }
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }

        }


    }
}
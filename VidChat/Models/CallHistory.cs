//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace VidChat.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class CallHistory
    {
        public System.Guid CallHistoryId { get; set; }
        public string CallerId { get; set; }
        public string ReceiverId { get; set; }
        public Nullable<System.DateTime> TimeCallBegan { get; set; }
        public Nullable<System.DateTime> TimeCallEnded { get; set; }
        public Nullable<System.Guid> CallInfoId { get; set; }
    }
}

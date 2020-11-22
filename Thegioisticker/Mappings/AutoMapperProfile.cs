using AutoMapper;
using Thegioisticker.Model;
using Thegioisticker.API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Thegioisticker.API.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Page, CategoryViewModel>();
        }

    }
}
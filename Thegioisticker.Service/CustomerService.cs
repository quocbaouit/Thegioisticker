using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    public interface ICustomerService
    {
        IEnumerable<Customer> GetCustomers();
        Customer GetCustomer(int id);
        void UpdateCustomer(Customer customer);
        void CreateCustomer(Customer customer);
        Customer GetCustomerById(int id);
        Customer GetCustomerByUserId(string id);
        void SaveCustomer();

        void DeleteCustomer(string customerId);
    }

    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository customerRepository;

        private readonly IUnitOfWork unitOfWork;

        public CustomerService(ICustomerRepository customerRepository, IUnitOfWork unitOfWork)
        {
            this.customerRepository = customerRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICustomerService Members

        public IEnumerable<Customer> GetCustomers()
        {
            var customers = customerRepository.GetMany(x => !x.isDelete);
            return customers;
        }
        public Customer GetCustomer(int id)
        {
            var customer = customerRepository.GetById(id);
            return customer;
        }
        public void UpdateCustomer(Customer customer)
        {
            customerRepository.Update(customer);
            SaveCustomer();
        }
        public void DeleteCustomer(string customerId)
        {
          var customer=  customerRepository.GetMany(x=>x.UserId==customerId).FirstOrDefault();
            customer.isDelete = true;
            customerRepository.Update(customer);
            SaveCustomer();
        }

        public void CreateCustomer(Customer customer)
        {
            customerRepository.Add(customer);
            SaveCustomer();
        }
        public Customer GetCustomerById(int id)
        {
          return  customerRepository.GetById(id);
        }
        public Customer GetCustomerByUserId(string id)
        {
            return customerRepository.GetMany(x=>x.UserId==id).FirstOrDefault();
        }
        public void SaveCustomer()
        {
            unitOfWork.Commit();
        }

        #endregion

    }
}

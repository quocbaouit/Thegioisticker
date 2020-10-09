using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    public interface IEmployeeService
    {
        IEnumerable<ApplicationUser> GetEmployees();
        ApplicationUser GetEmployee(int id);
        void UpdateEmployee(ApplicationUser employee);
        void CreateEmployee(ApplicationUser employee);
        ApplicationUser GetEmployeeById(int id);
        ApplicationUser GetEmployeeByUserId(string id);
        void SaveEmployee();
        void DeleteEmployee(string userId);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository employeeRepository;

        private readonly IUnitOfWork unitOfWork;
        private AuthRepository _repo = null;

        public EmployeeService(IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork)
        {
            this.employeeRepository = employeeRepository;
            this.unitOfWork = unitOfWork;
            this._repo = new AuthRepository();
        }

        #region IEmployeeService Members

        public IEnumerable<ApplicationUser> GetEmployees()
        {
            var employees = employeeRepository.GetMany(x=>x.isEmployee);
            return employees;
        }
        public ApplicationUser GetEmployee(int id)
        {
            var employee = employeeRepository.GetById(id);
            return employee;
        }
        public void UpdateEmployee(ApplicationUser employee)
        {
            employeeRepository.Update(employee);
            SaveEmployee();
        }

        public void CreateEmployee(ApplicationUser employee)
        {
            employeeRepository.Add(employee);
            SaveEmployee();
        }
        public ApplicationUser GetEmployeeById(int id)
        {
          return  employeeRepository.GetById(id);
        }
        public ApplicationUser GetEmployeeByUserId(string id)
        {
            return employeeRepository.GetMany(x=>x.Address==id).FirstOrDefault();
        }
        public void DeleteEmployee(string customerId)
        {
            var user = _repo.GetUserById(customerId);
            _repo.DeleteUser(user);
        }
        public void SaveEmployee()
        {
            unitOfWork.Commit();
        }

        #endregion

    }
}

﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Domains;
using WebAPI.Interfaces;
using WebAPI.Repositories;
using WebAPI.ViewModels;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClinicaController : ControllerBase
    {
        private IClinicaRepository clinicaRepository;
        public ClinicaController()
        {
            clinicaRepository = new ClinicaRepository();
        }

        [HttpGet("ListarTodas")]
        public IActionResult Get()
        {
            try
            {
                return Ok(clinicaRepository.Listar());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("BuscarPorId")]
        public IActionResult GetById(Guid id)
        {
            try
            {
                return Ok(clinicaRepository.BuscarPorId(id));

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Post(ClinicaViewModel clinicaModel)
        {
            try
            {
                Clinica clinica = new()
                {
                    NomeFantasia = clinicaModel.NomeFantasia,
                    Cnpj = clinicaModel.Cnpj,
                    RazaoSocial = clinicaModel.RazaoSocial,
                    Email = clinicaModel.Email,
                    Endereco = new()
                    {
                        Cep = clinicaModel.Cep,
                        Logradouro = clinicaModel.Logradouro,
                        Numero = clinicaModel.Numero,
                        Latitude = clinicaModel.Latitude,
                        Longitude = clinicaModel.Longitude,
                        Cidade = clinicaModel.Cidade,
                    }

                };
                clinicaRepository.Cadastrar(clinica);
                return StatusCode(201);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("BuscarPorCidade")]
        public IActionResult GetByCity(string cidade)
        {
            try
            {
                return Ok(clinicaRepository.ListarPorCidade(cidade));

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
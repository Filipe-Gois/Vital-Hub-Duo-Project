﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using WebAPI.Domains;
using WebAPI.Interfaces;
using WebAPI.Repositories;
using WebAPI.ViewModels;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicosController : ControllerBase
    {
        private IMedicoRepository _medicoRepository;
        public MedicosController()
        {
            _medicoRepository = new MedicoRepository();
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_medicoRepository.ListarTodos());

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("BuscarPorId")]
        public IActionResult GetById(Guid id)
        {
            try
            {
                return Ok(_medicoRepository.BuscarPorId(id)); ;

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public IActionResult AtualizarPerfil(MedicoViewModel medico)
        {
            try
            {
                Guid idUsuario = Guid.Parse(HttpContext.User.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value);

                return Ok(_medicoRepository.AtualizarPerfil(idUsuario, medico));

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public IActionResult Post(MedicoViewModel medicoModel)
        {
            try
            {

                Usuario user = new Usuario();
                user.Nome = medicoModel.Nome;
                user.Email = medicoModel.Email;
                user.TipoUsuarioId = medicoModel.IdTipoUsuario;
                user.Foto = medicoModel.Foto;
                user.Senha = medicoModel.Senha;

                user.Medico = new Medico();
                user.Medico.Crm = medicoModel.Crm;
                user.Medico.EspecialidadeId = medicoModel.EspecialidadeId;


                user.Medico.Endereco = new Endereco();
                user.Medico.Endereco.Logradouro = medicoModel.Logradouro;
                user.Medico.Endereco.Numero = medicoModel.Numero;
                user.Medico.Endereco.Cep = medicoModel.Cep;

                _medicoRepository.Cadastrar(user);

                return Ok();
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet("BuscarPorIdClinica")]
        public IActionResult GetByIdClinica(Guid id)
        {
            try
            {
                return Ok(_medicoRepository.ListarPorClinica(id)); ;

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
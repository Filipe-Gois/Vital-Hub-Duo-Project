﻿using WebAPI.Domains;
using WebAPI.ViewModels;

namespace WebAPI.Interfaces
{
    public interface IExameRepository
    {
        public void Cadastrar(Exame exame);

        public List<Exame> BuscarPorIdConsulta(Guid idConsulta);
        public void AtualizarExame(Guid idConsulta, ConsultaViewModel consultaViewModel);
    }
}
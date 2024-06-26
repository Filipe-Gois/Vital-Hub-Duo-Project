﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Contexts;
using WebAPI.Domains;
using WebAPI.Interfaces;
using WebAPI.Utils.BlobStorage;
using WebAPI.ViewModels;

namespace WebAPI.Repositories
{
    public class ExameRepository : IExameRepository
    {
        public VitalContext ctx = new VitalContext();
        private readonly string containerName = "containervitalhubfilipegoisg2";
        private readonly string connectionString = "DefaultEndpointsProtocol=https;AccountName=blobvitalhubfilipegoisg2;AccountKey=hfM4sN0TXxZyi9/g/T0AJTvRTYXeP05PE9WiZX37UOH5t9ERfLrtevegeuXLUsau/Uw6A4XajeaW+AStVhyL7Q==;EndpointSuffix=core.windows.net";



        public async Task<Exame> AtualizarExame(Exame exame)
        {
            Exame exameBuscado = ctx.Exames.Include(x => x.Consulta)
                    .FirstOrDefault(x => x.ConsultaId == exame.ConsultaId)! ?? throw new Exception("Exame não encontrado!");

            Uri uriExame = new Uri(exameBuscado.FotoExame!);
            await AzureBlobStorageHelper.DeleteBlobAsync(exameBuscado.BlobNameExame!);
            //await AzureBlobStorageHelper.DeleteBlobAsync(uriExame); 
            //tentar deletar só com a uri do blob

            exameBuscado.FotoExame = exame.FotoExame;
            exameBuscado.BlobNameExame = exame.BlobNameExame;
            exameBuscado.Descricao = exame.Descricao;




            ctx.Exames.Update(exameBuscado);
            ctx.SaveChanges();

            return exameBuscado;
        }
        //public async Task AtualizarExame(ExameViewModel exame)
        //{
        //    Exame exameBuscado = BuscarPorIdConsulta(exame.ConsultaId) ?? throw new Exception("Exame não encontrado!");


        //    //deleta o blobName do blob storage
        //    await AzureBlobStorageHelper.DeleteBlobAsync(connectionString, containerName, exameBuscado.BlobNameExame!);

        //    exameBuscado = await AzureBlobStorageHelper.UploadExameImageBlobAsync(exame.Imagem!, connectionString, containerName);

        //    exameBuscado.ConsultaId = exame.ConsultaId;
        //    exameBuscado.Descricao = exame.Descricao;


        //    ctx.Exames.Update(exameBuscado);
        //    await ctx.SaveChangesAsync();

        //}

        public Exame BuscarPorIdConsulta(Guid idConsulta)
        {
            try
            {
                return ctx.Exames
                    .FirstOrDefault(x => x.ConsultaId == idConsulta)!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Cadastrar(Exame exame)
        {
            try
            {
                Exame exameBuscado = ctx.Exames.Include(x => x.Consulta)
                    .FirstOrDefault(x => x.ConsultaId == exame.ConsultaId)!;

                Consulta consultaBuscada = ctx.Consultas.Include(x => x.Situacao).FirstOrDefault(x => x.Id == exame.ConsultaId)! ?? throw new Exception("Consulta não encontrada!");

                if (exameBuscado != null || consultaBuscada.Situacao!.Situacao != "Realizada" || consultaBuscada.DataConsulta > DateTime.Now)
                {
                    throw new Exception("Impossível cadastrar exame!");
                }
                ctx.Exames.Add(exame);
                ctx.SaveChanges();

            }
            catch (Exception)
            {
                throw;
            }
        }



    }
}
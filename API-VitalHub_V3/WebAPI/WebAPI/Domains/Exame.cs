﻿using System;
using System.Collections.Generic;

namespace WebAPI.Domains;

public partial class Exame
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string? Descricao { get; set; }

    public Guid? ConsultaId { get; set; }
    public string? FotoExame { get; set; }
    public string? BlobNameExame { get; set; }

    public virtual Consulta? Consulta { get; set; }
}

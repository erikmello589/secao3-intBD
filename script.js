function limparDados() 
{
  let text = "ATENÇÃO!\nessa tarefa apagará todos os dados preenchidos, deseja prosseguir?";
  if (confirm(text) == true) 
  {
    var campos = document.querySelectorAll("input");

    campos.forEach((campo) => 
    {  
    campo.checked = false;
    campo.value = "";
    })
  } 
  else 
  {
    return;
  }
}

function mascaraCpf(itemCpf)
{
   
    var variavelCpf = itemCpf.value;
    
    if (isNaN(variavelCpf[variavelCpf.length-1])) // verificando e impedindo que seja tolerados caracteres que não sejam numeros
    { 
        itemCpf.value = variavelCpf.substring(0, variavelCpf.length-1);
        return;
    }
     

    itemCpf.setAttribute("maxlength", "14");
    if (variavelCpf.length == 3 || variavelCpf.length == 7) itemCpf.value += ".";
    if (variavelCpf.length == 11) itemCpf.value += "-";
 
}

function mascaraRg (itemRg)
{
    var variavelRg = itemRg.value;

    if (isNaN(variavelRg[variavelRg.length-1])) // verificando e impedindo que seja tolerados caracteres que não sejam numeros
    { 
        itemRg.value = variavelRg.substring(0, variavelRg.length-1);
        return;
    }

    itemRg.setAttribute("maxlength", "12");
    if (variavelRg.length == 2 || variavelRg.length == 6) itemRg.value += ".";
    if (variavelRg.length == 10) itemRg.value += "-";
}

function limitaCep (itemCep)
{
  var variavelCep = itemCep.value;

    if (isNaN(variavelCep[variavelCep.length-1])) // verificando e impedindo que seja tolerados caracteres que não sejam numeros
    { 
      itemCep.value = variavelCep.substring(0, variavelCep.length-1);
        return;
    }

    itemCep.setAttribute("maxlength", "8");
}

function consultaEndereco()
{
  let cep = document.querySelector('#cep').value;

  if (cep.length !== 8)
  {
    alert('CEP Inválido!');
    return;
  }

  let url = "https://viacep.com.br/ws/" + cep + "/json/";
  
  fetch(url).then(function(response){
    response.json().then(function(dados)
    {
      console.log(dados);
      preencheEndereco(dados);
    })
    
  })
}

function preencheEndereco (dados)
{
  if (dados.erro)
  {
    alert('Não foi possível localizar o endereço pelo CEP, verifique-o ou preencha manualmente.');
  }
  else
  {
    document.getElementById('endereco').value = `${dados.logradouro}` + `, ${dados.bairro}` + ` - ${dados.localidade}` + `/${dados.uf}`;
    document.getElementById('complemento').value = `${dados.complemento}`;
  }

}

function geraBancoDados ()
{
  var bancoDados = openDatabase('bancoTeste', '1.0', 'Banco secao 3 - Provider It', 2 * 1024 * 1024); 
  var nome = document.querySelector('input[name="name"]').value;
  var rg = document.querySelector('input[name="rg"]').value;
  var cpf = document.querySelector('input[name="cpf"]').value;
  var cep = document.querySelector('input[name="cep"]').value;
  var endereco = document.querySelector('input[name="endereco"]').value;
  var numeroEndereco = document.querySelector('input[name="numero"]').value;
  var complemento = document.querySelector('input[name="complemento"]').value;
  var sexo = document.getElementById("sex").value;
  var dataNas = formatDate(document.querySelector('input[name="data"]').value);
  var sitCivil = document.querySelector('input[name="sitCivil"]:checked').value;

    
  bancoDados.transaction(function (tx) 
  { 
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS fichas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, rg TEXT, cpf TEXT, cep TEXT, endereco TEXT, numeroEndereco TEXT, complemento TEXT, sexo TEXT, dataNasc TEXT, sitCivil TEXT)'); 
    console.log(bancoDados);
    tx.executeSql('INSERT INTO fichas (nome, rg, cpf, cep, endereco, numeroEndereco, complemento, sexo, dataNasc, sitCivil) VALUES (?,?,?,?,?,?,?,?,?,?)', [nome, rg, cpf, cep, endereco, numeroEndereco, complemento, sexo, dataNas, sitCivil]); 

  })

  listaTabela();
}

function formatDate(date)
{
  let day = date.substring(8, 10);
  let month = date.substring(5, 7);
  let year = date.substring(0, 4);
  return `${day}/${month}/${year}`;
}

function listaTabela ()
{
  event.preventDefault();
  var bancoDados = openDatabase('bancoTeste', '1.0', 'Banco secao 3 - Provider It', 2 * 1024 * 1024);
  var tbody = document.getElementById('tbody');
  tbody.innerText = "";

  bancoDados.transaction(function (tx) 
  { 
    tx.executeSql('SELECT * FROM fichas', [], function (tx, results) 
    { 
      var len = results.rows.length
      var i;

      for (i = 0; i < len; i++) 
      { 
        let tr = tbody.insertRow();
        
        let td_id = tr.insertCell();
        let td_nome = tr.insertCell();
        let td_rg = tr.insertCell();
        let td_cpf = tr.insertCell();
        let td_cep = tr.insertCell();
        let td_endereco = tr.insertCell();
        let td_numeroEndereco = tr.insertCell();
        let td_complemento = tr.insertCell();
        let td_sexo = tr.insertCell();
        let td_dataNas = tr.insertCell();
        let td_sitCivil = tr.insertCell();
        let td_excluir = tr.insertCell();
        var button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Excluir Cad.';
        button.onclick = deletar(exemplo);

        td_id.innerText = results.rows.item(i).id;
        td_nome.innerText = results.rows.item(i).nome;
        td_rg.innerText = results.rows.item(i).rg;
        td_cpf.innerText = results.rows.item(i).cpf;
        td_cep.innerText = results.rows.item(i).cep;
        td_endereco.innerText = results.rows.item(i).endereco;
        td_numeroEndereco.innerText = results.rows.item(i).numeroEndereco;
        td_complemento.innerText = results.rows.item(i).complemento;
        td_sexo.innerText = results.rows.item(i).sexo;
        td_dataNas.innerText = results.rows.item(i).dataNasc;
        td_sitCivil.innerText = results.rows.item(i).sitCivil;
        td_excluir.appendChild(button);
        
      } 
    }, null); 
    }); 

    /*bancoDados.transaction(function(tx) {
      tx.executeSql('DROP TABLE fichas');
    });*/
}

function validaCpf (itemCpf)
{
  var i, j=10;
  var mult, soma=0, resto;
  
  for(i=0; i<11; i++)
  {
    if (!isNaN(itemCpf.value[i]))
    {
      mult = itemCpf.value[i] * j;
      soma += mult;
      j--;
    }
  }
  resto = (soma*10)%11;
  if(resto == 10) resto=0;

  if (resto != itemCpf.value[12])
  {
    alert("CPF Inválido.");
    itemCpf.value = "";
    return;
  }
  else
  {
    j = 11;
    soma = 0;
    for(i=0; i<13;i++)
    {
      if (!isNaN(itemCpf.value[i]))
      {
        mult = itemCpf.value[i] * j;
        soma += mult;
        j--;
      }
    }
    resto = (soma*10)%11;
    if(resto == 10) resto=0;

    if(resto != itemCpf.value[13]) 
    {
      alert("CPF Inválido.");
      itemCpf.value = "";
      return;
    }
  }
}

function validaNome (itemNome)
{
  var palavras = itemNome.value.split(" ");

  if(palavras.length < 2)
  {
    alert("Nome Inválido, digite no minimo dois nomes.");
    itemNome.value = "";
    return;
  }
  return;
}


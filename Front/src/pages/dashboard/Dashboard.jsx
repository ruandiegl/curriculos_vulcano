import React from 'react';
import './styles.css';
import logo from '../../../media/logo.png';

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <img src={logo} alt="Metalurgica Vulcano" />
          </div>
          <nav className="header-nav">
            <a href="#" className="nav-link">Gerenciar Currículos</a>
            <a href="#" className="nav-link">Gerenciar Vagas</a>
            <button className="logout-button">Sair</button>
          </nav>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="search-section">
          <span className="section-category">Currículos</span>
          <h1 className="section-title">Gerenciar Currículos</h1>

          <div className="search-container">
            <div className="search-input-wrapper">
              <input type="text" placeholder="Digite sua busca" className="search-input" />
              <button className="clear-button">Limpar</button>
            </div>
          </div>
        </section>

        <section className="table-section">
          <div className="legend-container">
            <div className="legend-item"><span className="dot desconsiderado"></span> Desconsiderado</div>
            <div className="legend-item"><span className="dot entrevistado"></span> Entrevistado</div>
            <div className="legend-item"><span className="dot selecionado"></span> Selecionado</div>
            <div className="legend-item"><span className="dot visualizado"></span> Visualizado</div>
          </div>

          <div className="table-wrapper">
            <table className="curriculos-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Atuação Principal</th>
                  <th>Ações</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { nome: 'Adenilson knupp alves junior', email: 'junior-knupp@hotmail.com', cargo: 'SOLDADOR MIG/MAG', status: 'selecionado' },
                  { nome: 'Admilson Pereira Machado', email: 'admilson1machado@gmail.com', cargo: 'DESENHISTA PROJETISTA', status: 'visualizado' },
                  { nome: 'Adriano Luiz de O Bonfim', email: 'bonfim90@yahoo.com.br', cargo: 'ELETRICISTA', status: 'visualizado' },
                  { nome: 'ADRIZEA GONCALVES DE SOUZA GOMES', email: 'adrizeagoncalves@hotmail.com', cargo: 'ENGENHARIA', status: 'entrevistado' },
                  { nome: 'AESCA CRISTINA DE OLIVEIRA DOS REIS', email: 'aescacristina@yahoo.com.br', cargo: 'SEGURANÇA DO TRABALHO', status: 'visualizado' },
                ].map((item, index) => (
                  <tr key={index}>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                    <td>{item.cargo}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn">Apagar</button>
                        <button className="action-btn">Editar</button>
                        <button className="action-btn">Ver</button>
                      </div>
                    </td>
                    <td>
                      <span className={`status-dot ${item.status}`}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <button className="page-btn">&laquo;</button>
            <button className="page-btn">&lsaquo;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">5</button>
            <button className="page-btn">6</button>
            <button className="page-btn">7</button>
            <button className="page-btn">&rsaquo;</button>
            <button className="page-btn">&raquo;</button>
          </div>
        </section>
      </main>
    </div>
  );
}

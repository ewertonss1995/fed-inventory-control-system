import { formatarData } from './utilitario-formatador';

describe('utilitario-formatador', () => {
  describe('formatarData', () => {
    it('deve formatar uma data válida no formato dd/mm/yyyy', () => {
      const dataString = '2023-05-15T10:30:00';
      const resultadoEsperado = '15/05/2023';
      
      const resultado = formatarData(dataString);
      
      expect(resultado).toBe(resultadoEsperado);
    });

    it('deve formatar corretamente datas com dia e mês menores que 10', () => {
      const dataString = '2023-01-05T10:30:00';
      const resultadoEsperado = '05/01/2023';
      
      const resultado = formatarData(dataString);
      
      expect(resultado).toBe(resultadoEsperado);
    });

    it('deve formatar corretamente o último dia do ano', () => {
      const dataString = '2023-12-31T23:59:59';
      const resultadoEsperado = '31/12/2023';
      
      const resultado = formatarData(dataString);
      
      expect(resultado).toBe(resultadoEsperado);
    });

    it('deve formatar corretamente o primeiro dia do ano', () => {
      const dataString = '2023-01-01T00:00:00';
      const resultadoEsperado = '01/01/2023';
    
      const resultado = formatarData(dataString);
      
      expect(resultado).toBe(resultadoEsperado);
    });

    it('deve lidar com anos bissextos corretamente', () => {
      const dataString = '2024-02-29T12:00:00';
      const resultadoEsperado = '29/02/2024';
      
      const resultado = formatarData(dataString);
      
      expect(resultado).toBe(resultadoEsperado);
    });

    it('deve lidar com o objeto Date como entrada', () => {
      const data = new Date(2023, 8, 15);
      const resultadoEsperado = '15/09/2023';
      
      const resultado = formatarData(data.toISOString());
      
      expect(resultado).toBe(resultadoEsperado);
    });

    it('deve lidar com datas inválidas', () => {
      const dataInvalida = 'data-invalida';
      
      const resultado = formatarData(dataInvalida);

      expect(resultado).toMatch("NaN/NaN/NaN");
    });
  });
});
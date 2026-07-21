import axios from 'axios';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://petroxpertbackend.fly.dev';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 120000
});

export default class VariationsService {
  async getScrapedMarkets() {
    try {
      const response = await api.get('/scrape-mercados');

      return {
        gasoil: Number(response.data.gasoil),
        gasolina: Number(response.data.gasolina),
        tipoCambio: Number(response.data.tipoCambio)
      };
    } catch (error) {
      console.error(
        '❌ Error al obtener los datos de mercado:',
        error
      );
      throw error;
    }
  }

  async getLastSavedData() {
    try {
      const response = await api.get('/cierre-ultimo');
      return response.data;
    } catch (error) {
      console.error(
        '❌ Error al obtener los últimos datos guardados:',
        error
      );
      throw error;
    }
  }

  async getAllData() {
    try {
      const [markets, savedData] = await Promise.all([
        this.getScrapedMarkets(),
        this.getLastSavedData()
      ]);

      const gasoil = Number(markets.gasoil);
      const gasolina = Number(markets.gasolina);
      const tipoCambio = Number(markets.tipoCambio);

      const deltanwe = Number(savedData.deltanwe);
      const deltamed = Number(savedData.deltamed);
      const divisa = Number(savedData.divisa);
      const gna = Number(savedData.gna);
      const ice = Number(savedData.ice);

      const values = {
        gasoil,
        gasolina,
        tipoCambio,
        deltanwe,
        deltamed,
        divisa,
        gna,
        ice
      };

      const invalidValues = Object.entries(values)
        .filter(([, value]) => !Number.isFinite(value))
        .map(([key]) => key);

      if (invalidValues.length > 0) {
        throw new Error(
          `Valores inválidos recibidos: ${invalidValues.join(', ')}`
        );
      }

      const cotizacionGasoilnwe =
        ((gasoil + deltanwe) * 0.845) / tipoCambio;

      const cotizacionGasoilCierrenwe =
        ((ice + deltanwe) * 0.845) / divisa;

      const cotizacionGasoilmed =
        ((gasoil + deltamed) * 0.845) / tipoCambio;

      const variacionGasoil =
        cotizacionGasoilnwe - cotizacionGasoilCierrenwe;

      const gnaAeuro =
        ((gna / divisa) / 3.78541) * 1000;

      const precioGasolina =
        ((gasolina / tipoCambio) / 3.78541) * 1000;

      const variacionGasolina =
        precioGasolina - gnaAeuro;

      return {
        cotizacionGasoilnwe: Number(
          cotizacionGasoilnwe.toFixed(2)
        ),
        cotizacionGasoilCierrenwe: Number(
          cotizacionGasoilCierrenwe.toFixed(2)
        ),
        variacionGasoil: Number(
          variacionGasoil.toFixed(2)
        ),
        tipoCambio: Number(
          tipoCambio.toFixed(4)
        ),
        gasoilScraped: Number(
          gasoil.toFixed(2)
        ),
        variacionGasolina: Number(
          variacionGasolina.toFixed(2)
        ),
        gasolinaScraped: Number(
          gasolina.toFixed(4)
        ),
        cotizacionGasoilmed: Number(
          cotizacionGasoilmed.toFixed(2)
        )
      };
    } catch (error) {
      console.error(
        '❌ Error al obtener todos los datos:',
        error
      );
      throw error;
    }
  }
}
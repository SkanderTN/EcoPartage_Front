import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Leaf } from 'lucide-react';
import IllustrationImg from '../assets/Illustration.png';
import DonImg from '../assets/Don.png';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-12">
        
        {/* Section Hero avec illustration */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8 font-crimson">
                Donnons une seconde vie à nos ressources 
                <span className="ml-2">✨</span>
              </h2>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={IllustrationImg} 
                alt="Illustration EcoPartage - Personnes échangeant des ressources"
                className="max-w-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Section Mission */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-[#FFB23F] font-crimson">
                Notre Mission
              </h3>
              <div className="flex items-start">
                <Leaf className="text-teal-500 mr-3 mt-1 flex-shrink-0" size={24} />
                <p className="text-[#AFADB5] leading-relaxed font-crimson text-lg">
                  Chez EcoPartage, nous croyons qu'aucune ressource ne devrait finir à la poubelle 
                  alors qu'elle peut encore servir. Notre plateforme a pour objectif de réduire le 
                  gaspillage en mettant en relation ceux qui possèdent des surplus, des invendus 
                  ou des matériaux inutilisés, avec ceux qui peuvent leur offrir une seconde vie. 
                  Nous souhaitons ainsi favoriser une économie circulaire locale, plus solidaire et 
                  plus respectueuse de l'environnement.
                </p>
              </div>
            </div>
            
            {/* Placeholder pour l'image de don */}
            <div className="flex justify-center">
              <img 
                src={DonImg} 
                alt="Boîte de don"
                className="max-w-xs w-full"
              />
            </div>
          </div>
        </section>

        {/* Section Histoire */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-[#FFB23F] font-crimson">
              Notre histoire
            </h3>
            <div className="flex items-start">
              <Leaf className="text-teal-500 mr-3 mt-1 flex-shrink-0" size={24} />
              <p className="text-[#AFADB5] leading-relaxed font-crimson text-lg">
                L'idée d'EcoPartage est née d'un constat simple : chaque jour, des tonnes de 
                produits parfaitement utilisables sont jetées faute de débouchés. Entreprises, 
                artisans, commerçants... tous génèrent parfois des surplus qu'ils ne peuvent 
                écouler. En parallèle, associations, créateurs et particuliers recherchent ces 
                mêmes ressources pour leurs projets ou leurs besoins quotidiens. Nous avons 
                voulu créer un pont entre ces deux mondes, pour limiter le gaspillage et 
                encourager la solidarité locale.
              </p>
            </div>
          </div>
        </section>

        {/* Section Appel à l'action */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6 text-[#FFB23F] font-crimson">
              Appel à l'action
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[#AFADB5] font-crimson text-lg mb-2">
                  <strong>Prêt(e) à rejoindre l'aventure ?</strong>
                </p>
                <p className="text-[#AFADB5] font-crimson text-lg">
                  Ensemble, réduisons le gaspillage et créons une économie plus circulaire et 
                  solidaire. Inscrivez-vous dès maintenant sur EcoPartage et donnez une seconde 
                  vie à vos ressources !
                </p>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg"
                  onClick={() => navigate('/register')}
                >
                  S'inscrire →
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default AboutPage;
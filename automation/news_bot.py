import feedparser
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from google import genai
import time 
import re   
import hashlib
from google.genai import types

# 1. CONFIGURAÇÕES (IA + FIREBASE)
GEMINI_KEY = "AIzaSyCcGiP2XwdCkwSfYxko1_k8vszkKEYqbV0" 
# Corrigido para api_key (padrão da SDK google-genai)
# No topo do arquivo
from google.genai import types

# Altere a linha do cliente para:
client = genai.Client(
    api_key=GEMINI_KEY,
    http_options={'api_version': 'v1beta'} # Isso resolve o conflito do 404
)

try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("// REDATOR_IA_ATIVO: CONEXÃO_ESTABELECIDA")
except Exception as e:
    print(f"// ERRO_FIREBASE: {e}")
    exit()

def get_full_content(url):
    """Extrai fatos brutos para alimentar a IA"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        return " ".join([p.get_text() for p in paragraphs if len(p.get_text()) > 80][:5])
    except:
        return None

def redigir_materia_propria(titulo, fatos):
    time.sleep(30) 
    prompt = f"Baseado nestes fatos: {fatos}\n\nRedija uma matéria de blog original com o título: {titulo}."
    
    try:
        # Mudança: Usando 'models/gemini-1.5-flash' explicitamente
        response = client.models.generate_content(
            model="models/gemini-1.5-flash", 
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="Você é um redator sênior brasileiro especializado em tecnologia.",
                temperature=0.7,
            )
        )
        return response.text
    except Exception as e:
        print(f"// FALHA_IA: {e}")
        return None
def fetch_and_post_news():
    feeds = [
        {"url": "https://tecnoblog.net/feed/", "nome": "Tecnoblog"},
        {"url": "https://www.tabnews.com.br/rss", "nome": "TabNews"}
    ]
    
    print(f"// INICIANDO_REDAÇÃO: {datetime.now().strftime('%H:%M:%S')}")

    for source in feeds:
        feed = feedparser.parse(source['url'])
        # Processa apenas 1 por fonte para garantir estabilidade da quota
        for entry in feed.entries[:1]:
            clean_id = hashlib.md5(entry.link.encode()).hexdigest()[:15]
            doc_ref = db.collection('posts').document(clean_id)
            
            if doc_ref.get().exists: continue

            print(f"// REDIGINDO_IA: {entry.title}")
            fatos_brutos = get_full_content(entry.link) or entry.summary
            
            materia_nova = redigir_materia_propria(entry.title, fatos_brutos)

            if not materia_nova: continue

            data_materia = datetime(*entry.published_parsed[:6]) if hasattr(entry, 'published_parsed') else datetime.now()

            new_post = {
                "titulo": entry.title,
                "resumo": materia_nova[:250].replace('\n', ' ') + "...",
                "conteudo": materia_nova,
                "categoria": "TECNOLOGIA",
                "data": data_materia,
                "timestamp": data_materia,
                "fonteNome": source['nome'],
                "fonteLink": entry.link,
                "autor": "IGOR_OS_WRITER",
                "imagemUrl": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
            }

            try:
                doc_ref.set(new_post)
                print(f">>> MATÉRIA_ORIGINAL_POSTADA: {entry.title[:30]}")
            except Exception as e:
                print(f"// ERRO_DEPLOY: {e}")

if __name__ == "__main__":
    fetch_and_post_news()
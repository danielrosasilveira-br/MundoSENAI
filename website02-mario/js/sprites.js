/**
 * Sistema de Sprites, Gráficos e Renderização Canvas
 * Estilo Super Mario World com Elementos SENAI
 * Totalmente compatível com todos os navegadores modernos e legados
 */

// Polyfill universal para CanvasRenderingContext2D.prototype.roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
        if (!radii) radii = 0;
        let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
        r = Math.min(Math.abs(r), Math.abs(w) / 2, Math.abs(h) / 2);
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

class SpriteRenderer {
    constructor() {
        this.senaiImage = new Image();
        this.senaiImageLoaded = false;
        
        // Tenta carregar o logo oficial
        this.senaiImage.onload = () => {
            this.senaiImageLoaded = true;
        };
        this.senaiImage.onerror = () => {
            // Se falhar o caminho relativo, tenta caminho alternativo
            this.senaiImage.src = 'assets/logo-senai.png';
        };
        this.senaiImage.src = 'senai-logo.png';
    }

    // Método utilitário à prova de falhas para retângulos arredondados
    drawRoundRect(ctx, x, y, w, h, r = 4) {
        if (typeof ctx.roundRect === 'function') {
            try {
                ctx.roundRect(x, y, w, h, r);
                return;
            } catch (e) {}
        }
        if (typeof ctx.arcTo === 'function') {
            try {
                r = Math.min(Math.abs(r), Math.abs(w) / 2, Math.abs(h) / 2);
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
                return;
            } catch (e) {}
        }
        ctx.rect(x, y, w, h);
    }

    // Desenha o Mario completo com suporte a animações e Modo SENAI
    drawMario(ctx, x, y, width, height, state, facingRight, hasSuperPower, tick) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);
        if (!facingRight) {
            ctx.scale(-1, 1);
        }

        // Aura de Superpoder SENAI
        if (hasSuperPower) {
            ctx.save();
            const pulse = (Math.sin(tick * 0.2) + 1) * 0.5;
            ctx.shadowColor = (tick % 10 < 5) ? '#ED1C24' : '#00E5FF';
            ctx.shadowBlur = 18 + pulse * 12;

            // Halo tecnológico de energia ao redor do personagem
            ctx.strokeStyle = (tick % 6 < 3) ? 'rgba(237, 28, 36, 0.8)' : 'rgba(0, 229, 255, 0.9)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(0, -height / 2, width * 0.75 + pulse * 4, height * 0.6 + pulse * 4, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Faíscas elétricas orbitando
            for (let i = 0; i < 4; i++) {
                const angle = (tick * 0.15) + (i * Math.PI / 2);
                const sparkDistX = (width * 0.7) * Math.cos(angle);
                const sparkDistY = -height / 2 + (height * 0.55) * Math.sin(angle);
                ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#FFD700';
                ctx.beginPath();
                ctx.arc(sparkDistX, sparkDistY, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Configuração de cores (Modo Normal vs Modo SENAI)
        const capColor = hasSuperPower ? '#ED1C24' : '#E52521';
        const shirtColor = hasSuperPower ? '#FFFFFF' : '#E52521';
        const overallColor = hasSuperPower ? '#003A80' : '#002B7F'; // Azul SENAI tecnológico
        const skinColor = '#FFD29D';
        const shoeColor = '#6A3805';

        const w = width;
        const h = height;

        // Animação de corrida (offset de pernas e corpo)
        let legOffset = 0;
        let bobY = 0;
        if (state === 'walk') {
            const frame = Math.floor(tick / 5) % 4;
            legOffset = (frame === 1 ? -4 : (frame === 3 ? 4 : 0));
            bobY = (frame % 2 === 1 ? -2 : 0);
        } else if (state === 'jump') {
            bobY = -3;
        } else if (state === 'crouch') {
            bobY = 6;
        }

        // Pés / Sapatos
        ctx.fillStyle = shoeColor;
        if (state === 'jump') {
            // Pés encolhidos no ar
            ctx.beginPath();
            this.drawRoundRect(ctx, -w * 0.42, -6, w * 0.38, 7, 3);
            this.drawRoundRect(ctx, w * 0.05, -10, w * 0.38, 7, 3);
            ctx.fill();
        } else if (state === 'crouch') {
            ctx.beginPath();
            this.drawRoundRect(ctx, -w * 0.45, -6, w * 0.9, 7, 3);
            ctx.fill();
        } else {
            // Pé de trás
            ctx.beginPath();
            this.drawRoundRect(ctx, -w * 0.42 - legOffset, -7, w * 0.36, 7, 3);
            ctx.fill();
            // Pé da frente
            ctx.beginPath();
            this.drawRoundRect(ctx, w * 0.06 + legOffset, -7, w * 0.36, 7, 3);
            ctx.fill();
        }

        // Pernas / Macacão inferior
        ctx.fillStyle = overallColor;
        if (state === 'crouch') {
            ctx.fillRect(-w * 0.35, -14, w * 0.7, 9);
        } else {
            ctx.fillRect(-w * 0.32 - legOffset * 0.6, -14, w * 0.28, 9);
            ctx.fillRect(w * 0.04 + legOffset * 0.6, -14, w * 0.28, 9);
        }

        // Tronco (Macacão + Camisa)
        const torsoY = -h * 0.55 + bobY;
        const torsoH = h * 0.35;
        
        // Camisa de fundo
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-w * 0.34, torsoY, w * 0.68, torsoH);

        // Macacão corpo central
        ctx.fillStyle = overallColor;
        ctx.fillRect(-w * 0.26, torsoY + 2, w * 0.52, torsoH - 2);

        // Alças do macacão
        ctx.fillRect(-w * 0.28, torsoY - 2, w * 0.15, torsoH);
        ctx.fillRect(w * 0.13, torsoY - 2, w * 0.15, torsoH);

        // Botões dourados do macacão
        ctx.fillStyle = '#FDD835';
        ctx.beginPath();
        ctx.arc(-w * 0.2, torsoY + 4, 2, 0, Math.PI * 2);
        ctx.arc(w * 0.2, torsoY + 4, 2, 0, Math.PI * 2);
        ctx.fill();

        // Braços
        ctx.fillStyle = shirtColor;
        if (state === 'jump') {
            // Braço levantado estilo Mario celebrando o pulo!
            ctx.fillRect(w * 0.18, torsoY - 8, w * 0.2, w * 0.35);
            // Luva branca
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(w * 0.28, torsoY - 10, 5, 0, Math.PI * 2);
            ctx.fill();

            // Braço de trás para equilíbrio
            ctx.fillStyle = shirtColor;
            ctx.fillRect(-w * 0.38, torsoY + 2, w * 0.16, w * 0.25);
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-w * 0.3, torsoY + w * 0.28, 4.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Braço balançando
            ctx.fillRect(w * 0.18 - legOffset * 0.5, torsoY + 2, w * 0.18, w * 0.3);
            ctx.fillStyle = '#FFFFFF'; // Luva
            ctx.beginPath();
            ctx.arc(w * 0.27 - legOffset * 0.5, torsoY + w * 0.32, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = shirtColor;
            ctx.fillRect(-w * 0.36 + legOffset * 0.5, torsoY + 2, w * 0.18, w * 0.3);
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-w * 0.27 + legOffset * 0.5, torsoY + w * 0.32, 4.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Cabeça e Rosto
        const headY = -h * 0.88 + bobY;
        const headR = w * 0.32;

        // Rosto base
        ctx.fillStyle = skinColor;
        ctx.beginPath();
        ctx.ellipse(w * 0.05, headY + 8, headR * 0.9, headR * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nariz grande clássico do Mario
        ctx.beginPath();
        ctx.ellipse(w * 0.28, headY + 7, headR * 0.38, headR * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        // Olho
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(w * 0.15, headY + 5, 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Brilho do olho
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(w * 0.14, headY + 4, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Bigode icônico
        ctx.fillStyle = '#221508';
        ctx.beginPath();
        ctx.ellipse(w * 0.25, headY + 11, headR * 0.48, headR * 0.22, 0.1, 0, Math.PI * 2);
        ctx.ellipse(w * 0.12, headY + 12, headR * 0.32, headR * 0.2, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // Costeleta / Cabelo de trás
        ctx.fillStyle = '#42240c';
        ctx.beginPath();
        ctx.ellipse(-w * 0.22, headY + 8, headR * 0.35, headR * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Chapéu vermelho com aba
        ctx.fillStyle = capColor;
        // Copa do chapéu
        ctx.beginPath();
        ctx.ellipse(w * 0.02, headY - 1, headR * 1.05, headR * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Aba do chapéu projetada para frente
        ctx.beginPath();
        ctx.ellipse(w * 0.24, headY + 2, headR * 0.68, headR * 0.25, 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Emblema frontal do chapéu
        if (hasSuperPower) {
            // Emblema SENAI Tecnológico brilhante
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-w * 0.02, headY - 2, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ED1C24';
            ctx.font = 'bold 8px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', -w * 0.02, headY - 2);
        } else {
            // Emblema Mario 'M'
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-w * 0.02, headY - 2, 5.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#E52521';
            ctx.font = 'bold 7px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('M', -w * 0.02, headY - 2);
        }

        ctx.restore();
    }

    // Desenha o Goomba (Cogumelo Inimigo clássico)
    drawGoomba(ctx, x, y, width, height, isSquashed, tick) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);

        if (isSquashed) {
            // Estado esmagado quando o Mario pula em cima
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(0, -6, width * 0.55, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Olhos fechados (linha horizontal)
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-width * 0.3, -6);
            ctx.lineTo(-width * 0.1, -6);
            ctx.moveTo(width * 0.1, -6);
            ctx.lineTo(width * 0.3, -6);
            ctx.stroke();
            ctx.restore();
            return;
        }

        const step = Math.floor(tick / 8) % 2;

        // Pés pretos que se movem
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.ellipse(-width * 0.28, step === 0 ? -4 : -2, width * 0.22, 4.5, 0, 0, Math.PI * 2);
        ctx.ellipse(width * 0.28, step === 1 ? -4 : -2, width * 0.22, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tronco bege
        ctx.fillStyle = '#FCE4C8';
        ctx.beginPath();
        this.drawRoundRect(ctx, -width * 0.25, -height * 0.45, width * 0.5, height * 0.4, 4);
        ctx.fill();

        // Cabeça marrom em formato de sino
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.moveTo(-width * 0.46, -height * 0.35);
        ctx.quadraticCurveTo(-width * 0.52, -height * 0.95, 0, -height);
        ctx.quadraticCurveTo(width * 0.52, -height * 0.95, width * 0.46, -height * 0.35);
        ctx.quadraticCurveTo(0, -height * 0.25, -width * 0.46, -height * 0.35);
        ctx.fill();

        // Sobrancelhas bravas
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(-width * 0.32, -height * 0.65);
        ctx.lineTo(-width * 0.08, -height * 0.55);
        ctx.lineTo(-width * 0.08, -height * 0.6);
        ctx.lineTo(-width * 0.32, -height * 0.7);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(width * 0.32, -height * 0.65);
        ctx.lineTo(width * 0.08, -height * 0.55);
        ctx.lineTo(width * 0.08, -height * 0.6);
        ctx.lineTo(width * 0.32, -height * 0.7);
        ctx.fill();

        // Olhos
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(-width * 0.18, -height * 0.5, 3.5, 5.5, 0, 0, Math.PI * 2);
        ctx.ellipse(width * 0.18, -height * 0.5, 3.5, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupilas
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-width * 0.15, -height * 0.5, 2, 0, Math.PI * 2);
        ctx.arc(width * 0.15, -height * 0.5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Dentinhos brancos pontudos
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(-width * 0.15, -height * 0.3);
        ctx.lineTo(-width * 0.08, -height * 0.38);
        ctx.lineTo(-width * 0.01, -height * 0.3);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(width * 0.15, -height * 0.3);
        ctx.lineTo(width * 0.08, -height * 0.38);
        ctx.lineTo(width * 0.01, -height * 0.3);
        ctx.fill();

        ctx.restore();
    }

    // Desenha o Koopa Troopa (Tartaruga)
    drawKoopa(ctx, x, y, width, height, isShell, facingRight, tick) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);
        if (!facingRight) {
            ctx.scale(-1, 1);
        }

        if (isShell) {
            // Casco verde giratório / recolhido
            ctx.fillStyle = '#2ECC71';
            ctx.beginPath();
            ctx.arc(0, -height * 0.45, width * 0.46, 0, Math.PI * 2);
            ctx.fill();

            // Bordas e placas hexagonais
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.ellipse(0, -height * 0.45, width * 0.22, height * 0.25, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#27AE60';
            ctx.beginPath();
            ctx.arc(0, -height * 0.45, width * 0.16, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            return;
        }

        const step = Math.floor(tick / 8) % 2;

        // Pés amarelos
        ctx.fillStyle = '#F1C40F';
        ctx.beginPath();
        ctx.ellipse(-width * 0.25, step === 0 ? -4 : -2, width * 0.2, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(width * 0.25, step === 1 ? -4 : -2, width * 0.2, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Casco verde
        ctx.fillStyle = '#2ECC71';
        ctx.beginPath();
        ctx.ellipse(-width * 0.05, -height * 0.48, width * 0.38, height * 0.42, -0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Cabeça amarela para a frente
        ctx.fillStyle = '#F1C40F';
        ctx.beginPath();
        ctx.ellipse(width * 0.25, -height * 0.78, width * 0.26, height * 0.24, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Bico
        ctx.fillStyle = '#E67E22';
        ctx.beginPath();
        ctx.moveTo(width * 0.38, -height * 0.72);
        ctx.lineTo(width * 0.52, -height * 0.74);
        ctx.lineTo(width * 0.38, -height * 0.65);
        ctx.fill();

        // Olho
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(width * 0.28, -height * 0.82, 3.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(width * 0.3, -height * 0.82, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Desenha o Item Especial: LOGOMARCA SENAI
    drawSenaiLogoItem(ctx, x, y, width, height, tick) {
        ctx.save();
        
        // Movimento flutuante suave (bobbing)
        const bob = Math.sin(tick * 0.08) * 5;
        const drawY = y + bob;
        const centerX = x + width / 2;
        const centerY = drawY + height / 2;

        // Aura de energia de alta tecnologia pulsante
        const pulse = (Math.sin(tick * 0.15) + 1) * 0.5;
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 12 + pulse * 14;

        // Anel de luz giratório
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.4 + pulse * 0.4})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, width * 0.65 + pulse * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Partículas brilhantes orbitando
        for (let i = 0; i < 3; i++) {
            const angle = (tick * 0.1) + (i * (Math.PI * 2 / 3));
            const px = centerX + Math.cos(angle) * (width * 0.7);
            const py = centerY + Math.sin(angle) * (height * 0.75);
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Se a imagem oficial estiver carregada, desenha a imagem
        if (this.senaiImageLoaded && this.senaiImage.naturalWidth > 0) {
            // Fundo cartão com cantos arredondados
            ctx.fillStyle = '#ED1C24';
            ctx.shadowColor = '#ED1C24';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            this.drawRoundRect(ctx, x, drawY, width, height, 6);
            ctx.fill();

            // Borda brilhante
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Desenha a imagem dentro com padding
            const pad = 2;
            ctx.drawImage(this.senaiImage, x + pad, drawY + pad, width - pad * 2, height - pad * 2);
        } else {
            // Renderização vetorial fiel em Canvas da logomarca oficial SENAI
            // Retângulo Vermelho SENAI Oficial (#ED1C24)
            ctx.fillStyle = '#ED1C24';
            ctx.beginPath();
            this.drawRoundRect(ctx, x, drawY, width, height, 5);
            ctx.fill();

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Faixas brancas horizontais do logo nas laterais
            ctx.fillStyle = '#FFFFFF';
            const stripeHeight = height * 0.08;
            const stripeGap = height * 0.055;
            const stripeW = width * 0.12;

            for (let i = 0; i < 5; i++) {
                const sy = drawY + height * 0.2 + i * (stripeHeight + stripeGap);
                // Faixas esquerdas
                ctx.fillRect(x + 2, sy, stripeW, stripeHeight);
                // Faixas direitas
                ctx.fillRect(x + width - stripeW - 2, sy, stripeW, stripeHeight);
            }

            // Tipografia "SENAI" em branco, itálica e ultra bold
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `italic 900 ${Math.floor(height * 0.58)}px "Impact", "Outfit", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SENAI', centerX, centerY + 1);
        }

        ctx.restore();
    }

    // Desenha Blocos: Interrogação '?', Tijolo, Pedra, Tubo, Chão
    drawBlock(ctx, x, y, width, height, type, bumpY = 0, isHit = false, tick = 0) {
        ctx.save();
        const safeBumpY = (typeof bumpY === 'number' && !isNaN(bumpY)) ? bumpY : 0;
        const drawY = (y || 0) + safeBumpY;

        if (type === 'question') {
            if (isHit) {
                // Bloco desativado / batido (marrom metálico fosco)
                ctx.fillStyle = '#9C6F47';
                ctx.fillRect(x, drawY, width, height);

                // Bordas de relevo interno
                ctx.strokeStyle = '#5E381A';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 1, drawY + 1, width - 2, height - 2);

                // Rebites nos 4 cantos
                ctx.fillStyle = '#42240C';
                const s = 4;
                ctx.fillRect(x + 3, drawY + 3, s, s);
                ctx.fillRect(x + width - 7, drawY + 3, s, s);
                ctx.fillRect(x + 3, drawY + height - 7, s, s);
                ctx.fillRect(x + width - 7, drawY + height - 7, s, s);
            } else {
                // Bloco ativo brilhante amarelo dourado
                const pulse = (Math.sin(tick * 0.12) + 1) * 0.5;
                const grad = ctx.createLinearGradient(x, drawY, x, drawY + height);
                grad.addColorStop(0, '#FFE066');
                grad.addColorStop(0.5, '#F5A623');
                grad.addColorStop(1, '#D97706');
                ctx.fillStyle = grad;
                ctx.fillRect(x, drawY, width, height);

                // Borda dourada 3D
                ctx.strokeStyle = '#B45309';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 1, drawY + 1, width - 2, height - 2);

                // Rebites nos 4 cantos
                ctx.fillStyle = '#78350F';
                const r = 3;
                ctx.beginPath();
                ctx.arc(x + 5, drawY + 5, r, 0, Math.PI * 2);
                ctx.arc(x + width - 5, drawY + 5, r, 0, Math.PI * 2);
                ctx.arc(x + 5, drawY + height - 5, r, 0, Math.PI * 2);
                ctx.arc(x + width - 5, drawY + height - 5, r, 0, Math.PI * 2);
                ctx.fill();

                // '?' Pulsante
                const qBob = Math.sin(tick * 0.1) * 1.5;
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowColor = 'rgba(0,0,0,0.4)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetY = 2;
                ctx.font = `900 ${Math.floor(height * 0.65)}px "Press Start 2P", "Outfit", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', x + width / 2, drawY + height / 2 + qBob);
            }
        } else if (type === 'brick') {
            // Tijolo clássico de terracota
            ctx.fillStyle = '#B45309';
            ctx.fillRect(x, drawY, width, height);

            // Textura de tijolos em linhas
            ctx.fillStyle = '#78350F';
            const midH = height / 2;
            ctx.fillRect(x, drawY + midH - 1, width, 2);

            // Linhas verticais alternadas
            ctx.fillRect(x + width / 2 - 1, drawY, 2, midH);
            ctx.fillRect(x + width / 4 - 1, drawY + midH, 2, midH);
            ctx.fillRect(x + width * 0.75 - 1, drawY + midH, 2, midH);

            // Destaque de luz no topo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x, drawY, width, 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x, drawY + height - 2, width, 2);
        } else if (type === 'ground') {
            // Chão com grama superior
            // Terra
            ctx.fillStyle = '#8B5A2B';
            ctx.fillRect(x, drawY, width, height);

            // Manchas de pedras na terra
            ctx.fillStyle = '#6B4226';
            ctx.fillRect(x + 6, drawY + 16, 8, 6);
            ctx.fillRect(x + width - 14, drawY + 24, 7, 5);

            // Camada de grama verde no topo
            ctx.fillStyle = '#2ECC71';
            ctx.fillRect(x, drawY, width, 10);

            // Detalhes de lâminas de grama pendendo
            ctx.fillStyle = '#27AE60';
            for (let i = 0; i < width; i += 8) {
                ctx.beginPath();
                ctx.moveTo(x + i, drawY + 10);
                ctx.lineTo(x + i + 4, drawY + 14);
                ctx.lineTo(x + i + 8, drawY + 10);
                ctx.fill();
            }

            // Linha de luz na grama
            ctx.fillStyle = '#58D68D';
            ctx.fillRect(x, drawY, width, 2);
        } else if (type === 'platform') {
            // Plataforma flutuante de madeira ou tecnologia
            ctx.fillStyle = '#34495E';
            ctx.fillRect(x, drawY, width, height);

            // Borda neon SENAI
            ctx.strokeStyle = '#00E5FF';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, drawY + 1, width - 2, height - 2);

            // Faixa central
            ctx.fillStyle = '#ED1C24';
            ctx.fillRect(x + 4, drawY + height / 2 - 2, width - 8, 4);
        } else if (type === 'pipe-top') {
            // Topo do cano verde (aba larga)
            const grad = ctx.createLinearGradient(x, drawY, x + width, drawY);
            grad.addColorStop(0, '#1E824C');
            grad.addColorStop(0.2, '#2ECC71');
            grad.addColorStop(0.5, '#58D68D');
            grad.addColorStop(0.8, '#27AE60');
            grad.addColorStop(1, '#145A32');
            ctx.fillStyle = grad;
            ctx.fillRect(x, drawY, width, height);

            // Borda do topo
            ctx.strokeStyle = '#0B3B17';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, drawY, width, height);
        } else if (type === 'pipe-body') {
            // Corpo do cano verde
            const grad = ctx.createLinearGradient(x, drawY, x + width, drawY);
            grad.addColorStop(0, '#1E824C');
            grad.addColorStop(0.2, '#2ECC71');
            grad.addColorStop(0.5, '#58D68D');
            grad.addColorStop(0.8, '#27AE60');
            grad.addColorStop(1, '#145A32');
            ctx.fillStyle = grad;
            ctx.fillRect(x, drawY, width, height);

            ctx.strokeStyle = '#0B3B17';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, drawY, width, height);
        }

        ctx.restore();
    }

    // Moeda Dourada 3D Giratória
    drawCoin(ctx, x, y, width, height, tick) {
        ctx.save();
        const spin = Math.cos(tick * 0.12);
        const wScale = Math.max(0.12, Math.abs(spin));
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        ctx.translate(centerX, centerY);
        ctx.scale(wScale, 1);

        // Corpo da moeda
        const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
        grad.addColorStop(0, '#F39C12');
        grad.addColorStop(0.3, '#F1C40F');
        grad.addColorStop(0.6, '#FFF59D');
        grad.addColorStop(1, '#D68910');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.45, height * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();

        // Borda interna
        ctx.strokeStyle = '#B7950B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.35, height * 0.38, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Linha central
        ctx.fillStyle = '#B7950B';
        ctx.fillRect(-2, -height * 0.28, 4, height * 0.56);

        ctx.restore();
    }

    // Mastro e Bandeira de Vitória SENAI
    drawFlagpole(ctx, x, y, height, flagProgress, isCleared, tick) {
        ctx.save();

        // Base de pedra
        ctx.fillStyle = '#7F8C8D';
        ctx.fillRect(x - 14, y + height - 20, 36, 20);
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 14, y + height - 20, 36, 20);

        // Mastro metálico listrado
        const poleWidth = 8;
        const grad = ctx.createLinearGradient(x, 0, x + poleWidth, 0);
        grad.addColorStop(0, '#BDC3C7');
        grad.addColorStop(0.5, '#ECF0F1');
        grad.addColorStop(1, '#95A5A6');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, poleWidth, height - 20);

        // Esfera / Estrela Dourada no topo
        const starPulse = (Math.sin(tick * 0.15) + 1) * 0.5;
        ctx.fillStyle = '#F1C40F';
        ctx.shadowColor = '#F1C40F';
        ctx.shadowBlur = 8 + starPulse * 6;
        ctx.beginPath();
        ctx.arc(x + poleWidth / 2, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bandeira SENAI (desce suavemente com flagProgress: 0 a 1)
        const flagY = y + (height - 50) * (flagProgress || 0);
        const flagW = 48;
        const flagH = 32;

        // Tecido da bandeira ondulando
        const wave = Math.sin(tick * 0.15) * 4;
        ctx.fillStyle = '#ED1C24';
        ctx.beginPath();
        ctx.moveTo(x + poleWidth, flagY);
        ctx.quadraticCurveTo(x + poleWidth + flagW / 2, flagY + wave, x + poleWidth + flagW, flagY + 4);
        ctx.lineTo(x + poleWidth + flagW, flagY + flagH + 4);
        ctx.quadraticCurveTo(x + poleWidth + flagW / 2, flagY + flagH + wave, x + poleWidth, flagY + flagH);
        ctx.closePath();
        ctx.fill();

        // Texto "SENAI" na bandeira
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'italic 900 10px sans-serif';
        ctx.fillText('SENAI', x + poleWidth + 6, flagY + flagH / 2 + 3 + wave * 0.5);

        ctx.restore();
    }

    // Fundo Parallax Rico (Céu, Nuvens fofas, Montanhas, Colinas)
    drawBackground(ctx, cameraX, width, height, tick) {
        ctx.save();

        // Gradiente do Céu estilo Super Mario World
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#4aa3ff');
        skyGrad.addColorStop(0.65, '#92d4ff');
        skyGrad.addColorStop(1, '#c9efff');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Camada 1: Nuvens flutuantes no fundo (parallax lento 0.08)
        const cloudOffset = ((cameraX || 0) * 0.08) % (width + 300);
        this.drawCloud(ctx, 120 - cloudOffset, 65, 80);
        this.drawCloud(ctx, 450 - cloudOffset, 90, 110);
        this.drawCloud(ctx, 800 - cloudOffset, 55, 95);
        this.drawCloud(ctx, 1200 - cloudOffset, 75, 120);

        // Camada 2: Montanhas distantes com gradiente e contorno (parallax 0.18)
        const mtnOffset = ((cameraX || 0) * 0.18) % 600;
        ctx.fillStyle = '#3AA35E';
        for (let mx = -mtnOffset - 200; mx < width + 400; mx += 300) {
            ctx.beginPath();
            ctx.ellipse(mx + 150, height - 80, 160, 240, 0, Math.PI, 0);
            ctx.fill();

            // Sombra da montanha
            ctx.fillStyle = '#2D8A4C';
            ctx.beginPath();
            ctx.ellipse(mx + 150, height - 80, 160, 240, 0, Math.PI, Math.PI * 1.5);
            ctx.fill();
            ctx.fillStyle = '#3AA35E';
        }

        // Camada 3: Colinas verdes médias com arbustos (parallax 0.35)
        const hillOffset = ((cameraX || 0) * 0.35) % 400;
        ctx.fillStyle = '#48C774';
        for (let hx = -hillOffset - 150; hx < width + 300; hx += 200) {
            ctx.beginPath();
            ctx.ellipse(hx + 100, height - 50, 120, 140, 0, Math.PI, 0);
            ctx.fill();

            // Arbustos menores
            ctx.fillStyle = '#2ECC71';
            ctx.beginPath();
            ctx.arc(hx + 50, height - 60, 22, 0, Math.PI * 2);
            ctx.arc(hx + 80, height - 70, 28, 0, Math.PI * 2);
            ctx.arc(hx + 110, height - 60, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#48C774';
        }

        ctx.restore();
    }

    // Desenha nuvem estilo Super Mario World com olhos pretos fofos
    drawCloud(ctx, x, y, size) {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(74, 163, 255, 0.4)';
        ctx.shadowBlur = 8;

        const r = size * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.arc(x + r * 0.9, y - r * 0.3, r * 1.1, 0, Math.PI * 2);
        ctx.arc(x + r * 1.9, y, r * 0.95, 0, Math.PI * 2);
        ctx.arc(x + r * 1.0, y + r * 0.3, r * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Olhos fofos estilo Mario World
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(x + r * 0.7, y - 2, 2, 4.5, 0, 0, Math.PI * 2);
        ctx.ellipse(x + r * 1.2, y - 2, 2, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Instância global para renderização
window.spriteRenderer = new SpriteRenderer();
